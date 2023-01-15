// ==UserScript==
// @name         namu.wiki
// @icon         https://namu.wiki/favicon.svg
// @version      1.0.10.20221226.0
// @downloadURL  http://localhost:5000/user-script?file-name=namu.wiki
// @match        https://namu.wiki/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// ==/UserScript==

// eslint-disable-next-line no-unused-vars
/* global GM_setValue, GM_getValue */

const GM_VALUE_CLASS1_NAME = 'class1Name'


// 로컬스토리지 설정, 사이드바 비활성, 고정폭 1000px
if (!localStorage.theseed_settings) {
	localStorage.theseed_settings = '{"senkawa.fixed_body":"1000","senkawa.hide_sidebar":true}'
	console.log('local storage loaded')
}


document.addEventListener('DOMContentLoaded', event => {
	// console.log(event)

	if (location.pathname.startsWith('/w/')) {
		// class1 element 찾기
		if (!document.querySelector(`.${GM_getValue(GM_VALUE_CLASS1_NAME, 'xxxx')}`)) {
			// 없으면 찾아서 class1Name 업데이트
			for (const element of document.querySelectorAll(`[href="${location.pathname}"]`)) {
				if (element._prevClass) {
					const elementDataset1 = Object.keys(element.dataset)[0].replace(/[A-Z]/g, m => '-' + m.toLowerCase())
					if (elementDataset1) {
						GM_setValue(GM_VALUE_CLASS1_NAME, document.querySelector(`[data-${elementDataset1}]`).classList[0])
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
	const class1Name = GM_getValue(GM_VALUE_CLASS1_NAME, 'xxxx')
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
	document.head.appendChild(document.createElement('style')).innerHTML = (`
.${class1Name} {
	filter: blur(0.25rem) invert(0.45);
	clip-path: inset(0px);
	user-select: none;
}
.${class1Name} > * {
	pointer-events: none;
}
`
	)
})
