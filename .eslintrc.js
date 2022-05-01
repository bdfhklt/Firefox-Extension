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
		// 탭 사용 금지
		'no-tabs': 'off',
		// 들여쓰기
		indent: ['warn', 'tab', { ignoreComments: true }],
		// 상수 선호
		'prefer-const': 'warn',
		// 다중 빈 줄 금지
		'no-multiple-empty-lines': ['warn', { max: 3 }],
		// 미사용 변수 금지
		'no-unused-vars': 'warn'
	}
}
