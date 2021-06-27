// ==UserScript==
// @name         test 1
// @version      20210627.2
// @match        localhost
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

// alert('test 1 script start')
console.log('test 1 script start')

// window.open('http://localhost')
window.addeventListener('message', (event) => {
	console.log(event)
})

// ;(() => {
// 	console.log('test 1 function start')
// 	GM_setValue('temp1', 'test val1')
// 	console.log(GM_getValue('temp1', 'nnnnn'))
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
