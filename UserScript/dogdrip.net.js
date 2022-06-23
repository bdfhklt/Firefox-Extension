// ==UserScript==
// @name         dogdrip.net
// @version      1.0.2.20220621.0
// @downloadURL  http://localhost:5000/user-script?file-name=dogdrip.net
// @match        https://www.dogdrip.net/*
// @grant        none
// @noframes
// ==/UserScript==

// 추천수 비중 하이라이트
for (const element of document.querySelectorAll('.voteNum')) {
	// 	element.parentElement.querySelector(".title").style.backgroundColor = `rgba(0,0,0,0.${(element.innerText).padStart(3,"0")})`
	element.parentElement.style.backgroundImage = `linear-gradient(to right, rgba(255,255,0,${(Math.tanh(element.innerText / 500) * 0.5)}) 30%, rgba(255,255,0,0) 70%)`
}
