module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'standard'
	],
	parserOptions: {
		ecmaVersion: 12
	},
	rules: {
		'no-tabs': 'off',
		indent: ['warn', 'tab', { ignoreComments: true }],
		'prefer-const': 'warn',
		'no-undef': 'off',
		'no-multiple-empty-lines': ['error', { max: 2 }]
	}
}
