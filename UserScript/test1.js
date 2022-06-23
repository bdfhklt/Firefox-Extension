// ==UserScript==
// @name         test 1
// @version      20220621.11
// @downloadURL  http://localhost:5000/user-script?file-name=test1
// @match        http://localhost/
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @noframes
// ==/UserScript==

// eslint-disable-next-line no-unused-vars
/* global unsafeWindow GM_setValue, GM_getValue, GM_deleteValue */

// alert('test 1 script start')
console.log('test 1 script start')

/*
디버거 디텍터 우회
	regex toString 디텍터
		디텍터 예시
		{
			const reg = / /
			let isOpen = false

			reg.toString = () => {
				isOpen = true
			}

			console.log(reg) // 디버거 열려 있는 동안 계속 감지 됨
		}
		우회
			console.log = () => {}

	중단점 해제 시간 간격을 이용한 디텍터
		우회
			디버거 옵션: 중단점 중지
 */

// window.open('http://localhost')
// window.addeventListener('message', (event) => {
// 	console.log(event)
// })

// document.body.insertAdjacentHTML('beforeend', '<div id="test1"></div>')
// document.querySelector('#test1').t1 = 123

// console.log(window)
// console.log(top)
// console.log(window === top)

// setTimeout(() => {
// 	top.postMessage('test message', '*')
// }, 1000)

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
