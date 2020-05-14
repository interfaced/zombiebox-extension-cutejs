/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path');
const fse = require('fs-extra');
const CuteJS = require('cutejs');

const {AbstractExtension, ISourceProvider} = require('zombiebox');

/**
 * @param {string} filePath
 * @return {boolean}
 */
function isJST(filePath) {
	return path.extname(filePath) === '.jst';
}

/**
 * @param {ISourceProvider} source
 * @return {Array<string>}
 */
function getJSTFiles(source) {
	return source.getFiles().filter(isJST);
}


/**
 */
module.exports = class extends AbstractExtension {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {CuteJS}
		 * @private
		 */
		this._cutejs = new CuteJS();

		this._cutejs.clientLibImportPath = 'cutejs-lib/cute-library';
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
	getSourcesDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	generateCode() {
		return Array.from(this._codeSource.aliasedSources)
			.reduce((result, [alias, fsSource]) => {
				const compileFile = (file) => this.compileTemplate(alias, file);
				const compiledTemplates = getJSTFiles(fsSource).map(compileFile);
				return Object.assign(result, ...compiledTemplates);
			}, {});
	}

	/**
	 * @override
	 */
	setCodeSource(codeSource) {
		super.setCodeSource(codeSource);

		for (const [alias, fsSource] of codeSource.aliasedSources) {
			fsSource.on(ISourceProvider.EVENT_CHANGED, (filePath) => {
				this._onChanged(alias, filePath);
			});
		}
	}

	/**
	 * @override
	 */
	getConfig() {
		const clientLibPath = CuteJS.getClientLibraryPath();
		const paths = fse.readdirSync(clientLibPath).map((file) => path.join(clientLibPath, file));
		const templatesPath = path.join(__dirname, 'templates');

		return {
			templates: [templatesPath],
			include: [
				{
					name: 'CuteJS client library',
					modules: paths,
					aliases: {
						'cutejs-lib': clientLibPath
					}
				}
			]
		};
	}

	/**
	 * @param {string} alias
	 * @param {string} filePath
	 * @return {?string}
	 */
	resolveAliasedFilePath(alias, filePath) {
		const aliasedSources = this._codeSource.aliasedSources;
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

		return {[`${resultFilePath}.js`]: this._cutejs.compile(fse.readFileSync(filePath, 'utf-8'))};
	}

	/**
	 * @param {string} alias
	 * @param {string} filePath
	 * @private
	 */
	_onChanged(alias, filePath) {
		const changes = this._generateChanges(alias, filePath);

		if (Object.keys(changes).length) {
			this.emit(AbstractExtension.EVENT_GENERATED, changes);
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
