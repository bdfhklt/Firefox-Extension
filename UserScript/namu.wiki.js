// ==UserScript==
// @name         namu.wiki
// @icon         https://namu.wiki/favicon.svg
// @version      1.0.13.20240112.1
// @downloadURL  http://localhost:5000/user-script?file-name=namu.wiki
// @match        https://namu.wiki/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// ==/UserScript==

// eslint-disable-next-line no-unused-vars
/* global GM_setValue, GM_getValue */

// * target *
// const GM_VALUE_CLASS1_NAME = 'class1Name'
const GM_VALUE_DATASET1_KEY = 'dataset1Name'


// 로컬스토리지 설정, 사이드바 비활성, 고정폭 1000px
if (!localStorage.theseed_settings) {
	localStorage.theseed_settings = '{"senkawa.fixed_body":"1000","senkawa.hide_sidebar":true}'
	console.log('local storage loaded')
}


document.addEventListener('DOMContentLoaded', event => {
	// console.log(event)

	if (location.pathname.startsWith('/w/')) {
		// target 찾기
		// if (!document.querySelector(`.${GM_getValue(GM_VALUE_CLASS1_NAME, 'xxxx')}`)) {
		if (!document.querySelector(`.${GM_getValue(GM_VALUE_DATASET1_KEY, 'xxxx')}`)) {
			// 없으면 찾아서 target 업데이트
			console.log('class1 not found')

			for (const element of document.querySelectorAll(`[href="${location.pathname}"]`)) {
				if (element._prevClass) {
					const elementDataset1 = Object.keys(element.dataset)[0].replace(/[A-Z]/g, m => '-' + m.toLowerCase())
					if (elementDataset1) {
						// GM_setValue(GM_VALUE_CLASS1_NAME, document.querySelector(`[data-${elementDataset1}]`).classList[0])
						GM_setValue(GM_VALUE_DATASET1_KEY, elementDataset1)
						break
					}
				}
			}
		}
	}

// 	// CSS 설정
// 	document.head.appendChild(document.createElement('style')).innerHTML =
// `div[class=""]>div>table,
// #search-ad,
// iframe[src*="/callad"]
// #custom-block-1 {
// 	filter: blur(0.25rem) invert(0.45);
// 	pointer-events: none;
// }`
	// CSS 설정
	// const class1Name = GM_getValue(GM_VALUE_CLASS1_NAME, 'xxxx')
	const dataset1Key = GM_getValue(GM_VALUE_DATASET1_KEY, 'xxxx')
// 	document.head.appendChild(document.createElement('style')).innerHTML = (`
// .${class1Name} {
// 	position: relative;
// }
// .${class1Name}::after {
// 	content: "";
// 	backdrop-filter: blur(0.25rem) invert(0.45);
// 	position: absolute;
// 	top: 0px;
// 	left: 0px;
// 	width: 100%;
// 	height: 100%;
// }
// `
// 	)
// 	document.head.appendChild(document.createElement('style')).innerHTML = (`
// .${CSS.escape(class1Name)} {
// 	filter: blur(0.25rem) invert(0.45);
// 	clip-path: inset(0px);
// 	user-select: none;
// }
// .${CSS.escape(class1Name)} > * {
// 	pointer-events: none;
// }
// `
// 	)
	document.head.appendChild(document.createElement('style')).innerHTML = (`
table[data-${dataset1Key}] {
	filter: blur(0.25rem) invert(0.45);
	clip-path: inset(0px);
	user-select: none;
}
table[data-${dataset1Key}] > * {
	pointer-events: none;
}
`
	)
})
