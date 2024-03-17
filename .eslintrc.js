module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: 'standard',
	overrides: [
		{
			env: {
				node: true
			},
			files: [
				'.eslintrc.{js,cjs}'
			],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		// 탭
		'no-tabs': 'off',
		// 들여쓰기
		indent: ['warn', 'tab', { ignoreComments: true }],
		// 상수 선호
		'prefer-const': 'warn',
		// 다중 빈 줄
		'no-multiple-empty-lines': ['warn', { max: 3 }],
		// 미사용 변수
		'no-unused-vars': 'warn',
		// 단축 구문
		'object-shorthand': ['warn', 'methods']
	}
}
