// ==UserScript==
// @name         test 2
// @version      20210430.3
// @match        localhost
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

// alert('test 2 script start')
console.log('test 2 script start')

;(() => {
	console.log('test 2 function start')
	// GM_setValue('temp1', 'test val1')
	console.log(GM_getValue('temp1', 'nnnnn'))
	// GM_deleteValue('temp1')
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
