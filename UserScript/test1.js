// ==UserScript==
// @name         test 1
// @version      20220430.19
// @match        localhost
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

// eslint-disable-next-line no-unused-vars
/* global unsafeWindow GM_setValue, GM_getValue, GM_deleteValue */

// alert('test 1 script start')
console.log('test 1 script start')

// window.open('http://localhost')
// window.addeventListener('message', (event) => {
// 	console.log(event)
// })

// document.body.insertAdjacentHTML('beforeend', '<div id="test1"></div>')
// document.querySelector('#test1').t1 = 123

// console.log(window)
// console.log(top)
// console.log(window === top)

setTimeout(() => {
	top.postMessage('test message', '*')
}, 1000)

// ;(() => {
// 	console.log('test 1 function start')
// 	// GM_setValue('temp1', 'test val1')
// 	// console.log(GM_getValue('temp1', 'nnnnn'))
// 	// GM_deleteValue('temp1')
// 	console.log('test 1 function end')
// })()

// ;(async () => {
// 	console.log('test 1 async function start')
// 	await GM_setValue('temp1', 'test val1')
// 	// await GM.deleteValue('temp1')
// 	console.log(await GM_getValue('temp1', 'nnnnn'))
// 	// console.log(await GM.listValues())
// 	console.log('test 1 async function end')
// })()

// Object.keys(window).forEach(key => { // 모든 이벤트 리스너
// 	if (/./.test(key)) {
// 		window.addEventListener(key.slice(2), event => {
// 			console.log(key, event)
// 		})
// 	}
// })

console.log('test 1 script end')
// alert('test 1 script end')
