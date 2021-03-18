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
		indent: ['error', 'tab'],
		'prefer-const': 'off',
		'no-undef': 'off'
	}
}
