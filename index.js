const path = require('path');
const fs = require('fs');
const CuteJS = require('cutejs');
const EventEmitter = require('events');

const IZBSourceProvider = require('zombiebox/lib/interfaces/i-source-provider');
const IZBExtension = require('zombiebox/lib/interfaces/i-zb-extension');

/**
 * @param {string} filePath
 * @return {boolean}
 */
function isJST(filePath) {
	return path.extname(filePath) === '.jst';
}

/**
 * @param {IZBSourceProvider} source
 * @return {Array<string>}
 */
function getJSTFiles(source) {
	return source.getFiles().filter(isJST);
}


/**
 * @implements {IZBExtension}
 */
module.exports = class extends EventEmitter {
	/**
	 * @override
	 */
	setApplication(zb) {
		const cutejs = new CuteJS();
		cutejs.clientLibImportPath = 'cutejs-lib/cute-library';

		/**
		 * @type {ZBApplication}
		 * @private
		 */
		this._zb = zb;

		/**
		 * @type {CuteJS}
		 * @private
		 */
		this._cutejs = cutejs;
	}

	/**
	 * @override
	 */
	generateCode(projectConfig) {
		return Array.from(this._zb.getCodeSource().aliasedSources)
			.reduce((result, [alias, fsSource]) => {
				const compileFile = (file) => this.compileTemplate(alias, file);
				const compiledTemplates = getJSTFiles(fsSource).map(compileFile);
				return Object.assign(result, ...compiledTemplates);
			}, {});
	}

	/**
	 * @override
	 */
	watchSources(codeSource) {
		const aliasedSources = Array.from(codeSource.aliasedSources);
		aliasedSources.forEach(([alias, fsSource]) => {
			fsSource.on(IZBSourceProvider.EVENT_CHANGED, (filePath) => {
				this._onChanged(alias, filePath);
			});
		});
	}

	/**
	 * @override
	 */
	getName() {
		return 'cutejs';
	}

	/**
	 * @override
	 */
	getPublicDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		const clientLibPath = CuteJS.getClientLibraryPath();
		const paths = fs.readdirSync(clientLibPath).map((file) => path.join(clientLibPath, file));
		const templatesPath = path.join(__dirname, 'templates');

		return {
			templateLocations: [templatesPath],
			compilation: {
				include: paths
			},
			aliases: {
				'cutejs-lib': clientLibPath
			}
		};
	}

	/**
	 * @param {string} alias
	 * @param {string} filePath
	 * @return {?string}
	 */
	resolveAliasedFilePath(alias, filePath) {
		const aliasedSources = this._zb.getCodeSource().aliasedSources;
		const fsSource = aliasedSources.get(alias);
		if (!fsSource) {
			return null;
		}

		const relativeFilePath = path.relative(fsSource.getRoot(), filePath);
		return path.join(alias, relativeFilePath);
	}

	/**
	 * @param {string} alias
	 * @param {string} filePath
	 * @return {Object<string, string>}
	 */
	compileTemplate(alias, filePath) {
		const resultFilePath = this.resolveAliasedFilePath(alias, filePath);

		return {[`${resultFilePath}.js`]: this._cutejs.compile(fs.readFileSync(filePath, 'utf-8'))};
	}

	/**
	 * @param {string} alias
	 * @param {string} filePath
	 * @private
	 */
	_onChanged(alias, filePath) {
		const changes = this._generateChanges(alias, filePath);

		if (Object.keys(changes).length) {
			this.emit(IZBExtension.EVENT_GENERATED, changes);
		}
	}

	/**
	 * @param {string} alias
	 * @param {string} filePath
	 * @return {Object<string, string>}
	 * @private
	 */
	_generateChanges(alias, filePath) {
		if (isJST(filePath)) {
			return this.compileTemplate(alias, filePath);
		}

		return {};
	}
};
