// ==UserScript==
// @name         alldic.daum.net
// @version      1.0.1.20220621.0
// @downloadURL  http://localhost:5000/user-script?file-name=alldic.daum.net
// @match        https://alldic.daum.net/*
// @grant        none
// @noframes
// ==/UserScript==

// 단어 발음 재생 2회 -> 1회
let count1 = 0
const interval1 = setInterval(() => {
	count1++
	if (count1 >= 8) {
		clearInterval(interval1)
	}
	for (const element of document.querySelectorAll('.btn_voice.btn_listen')) {
		element.attributes['data-count'].textContent = '1'
	}
	document.querySelector('#wordLayerSound').attributes['data-count'].textContent = '1'
}, 500)
