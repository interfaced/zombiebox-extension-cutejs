const {join, dirname} = require('path');
const {getClientLibraryPath} = require('cutejs');

function resolveModulePath(packageName) {
	const packageInfoPath = require.resolve(`${packageName}/package.json`);
	return join(dirname(packageInfoPath), require(packageInfoPath).module);
}

function override(originConfigPath, config) {
	return Object.assign(config, require(originConfigPath));
}

function createOverrides(map) {
	return Object.keys(map).map((key) => override(key, map[key]));
}

module.exports = {
	extends: 'interfaced',
	overrides: createOverrides({
		'eslint-config-interfaced/overrides/esm': {
			files: ['lib/**/*.js'],
			settings: {
				'import/resolver': {
					alias: [
						['zb', resolveModulePath('zombiebox')],
						['cutejs-lib', join(getClientLibraryPath())]
					]
				}
			}
		},
		'eslint-config-interfaced/overrides/node': {
			files: ['index.js']
		}
	})
};
