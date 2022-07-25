// ==UserScript==
// @name         namu.wiki
// @icon         https://namu.wiki/favicon.svg
// @version      1.0.5.20220701.1
// @downloadURL  http://localhost:5000/user-script?file-name=namu.wiki
// @match        https://namu.wiki/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

// 로컬스토리지 설정, 사이드바 비활성, 고정폭 1000px
if (!localStorage.theseed_settings) {
	localStorage.theseed_settings = '{"senkawa.fixed_body":"1000","senkawa.hide_sidebar":true}'
	console.log('local storage loaded')
}


// CSS 설정
document.addEventListener('DOMContentLoaded', event => {
	// console.log(event)
	document.head.appendChild(document.createElement('style')).innerHTML =
`div[class=""]>div>table,
#search-ad,
iframe[src*="/callad"] {
	filter: blur(0.25rem) invert(0.45);
	pointer-events: none;
}
`
})
