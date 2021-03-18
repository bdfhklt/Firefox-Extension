// ==UserScript==
// @name         test
// @version      20210318.1
// @match        localhost
// @grant        none
// ==/UserScript==

alert('test script start')
console.log('test script start')

// ;(async () => { // 테스트
//   console.log('async function start')
// //   await GM.setValue('temp1', 'test val1')
// //   await GM.deleteValue('temp1')
// //   console.log(await GM.getValue('temp1', 'nnnnn'))
//   console.log(await GM.listValues())
//   console.log('async function end')
// })()
// // if (1) {
// //   ;(async () => {
// //     console.log('test')
// //   })()
// // }

Object.keys(window).forEach(key => { // 모든 이벤트 리스너
	if (/./.test(key)) {
		window.addEventListener(key.slice(2), event => {
			console.log(key, event)
		})
	}
})

console.log('test script end')
alert('test script end')
