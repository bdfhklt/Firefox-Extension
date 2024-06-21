// ==UserScript==
// @name         public / chatgpt.com
// @icon         https://cdn.oaistatic.com/_next/static/media/favicon-32x32.630a2b99.png
// @version      1.0.0.20240607.4
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
	document.querySelector('div[role=presentation]').removeAttribute('tabIndex')
})
observer.observe(document.querySelector('#__next main'), { childList: true })
