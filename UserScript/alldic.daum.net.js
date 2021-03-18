// ==UserScript==
// @name         alldic.daum.net
// @version      20210318.1
// @match        https://alldic.daum.net/*
// @grant        none
// ==/UserScript==

// 단어 발음 재생 2회 -> 1회
let count1 = 0
let interval1 = setInterval(() => {
	count1++
	if (count1 >= 8) {
		clearInterval(interval1)
	}
	for (const element of document.querySelectorAll('.btn_voice.btn_listen')) {
		element.attributes['data-count'].textContent = '1'
	}
	document.querySelector('#wordLayerSound').attributes['data-count'].textContent = '1'
}, 500)
