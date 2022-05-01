// ==UserScript==
// @name         test 2
// @version      20220422.0
// @match        localhost
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

// eslint-disable-next-line no-unused-vars
/* global GM_setValue, GM_getValue, GM_deleteValue */

// alert('test 2 script start')
console.log('test 2 script start')

;(() => {
	console.log('test 2 function start')
	// GM_setValue('temp1', 'test val1')
	// console.log(GM_getValue('temp1', 'nnnnn'))
	// GM_deleteValue('temp1')

	setTimeout(() => {
		const temp1 = document.querySelector('#test1')
		console.log(temp1.t1)
	}, 1000)
	console.log('test 2 function end')
})()

// ;(async () => {
// 	console.log('test 2 async function start')
// 	await GM_setValue('temp1', 'test val1')
// 	// await GM.deleteValue('temp1')
// 	console.log(await GM_getValue('temp1', 'nnnnn'))
// 	// console.log(await GM.listValues())
// 	console.log('test 2 async function end')
// })()

console.log('test 2 script end')
// alert('test 2 script end')
