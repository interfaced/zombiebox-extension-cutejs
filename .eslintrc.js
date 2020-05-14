module.exports = {
	extends: 'interfaced',
	overrides: [
		{
			files: ['lib/**/*.js'],
			extends: 'interfaced/esm',
			rules: {
				'import/no-unresolved': ['error', {ignore: ['^cutejs-lib']}]
			},
			settings: {
				'import/resolver': 'zombiebox'
			}
		},
		{
			files: ['index.js', '.eslintrc.js'],
			extends: 'interfaced/node'
		}
	]
};
