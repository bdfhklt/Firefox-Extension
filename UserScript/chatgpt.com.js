// ==UserScript==
// @name         public / chatgpt.com
// @icon         https://cdn.oaistatic.com/_next/static/media/favicon-32x32.630a2b99.png
// @version      1.0.3.20241009.0
// @downloadURL  http://localhost:5000/user-script?file-name=chatgpt.com
// @match        https://chatgpt.com/*
// @grant        none
// @noframes
// ==/UserScript==

// 키보드 스크롤 안되는 현상 해결
setTimeout(() => {
	document.querySelector('div[role=presentation]').removeAttribute('tabIndex')
}, 1000)
const observer = new MutationObserver((mutationList) => {
	// console.log('log from MutationObserver')
	document.querySelector('div[role=presentation]').removeAttribute('tabIndex')
})
observer.observe(document.body, { childList: true })
observer.observe(document.querySelector('main'), { childList: true })
