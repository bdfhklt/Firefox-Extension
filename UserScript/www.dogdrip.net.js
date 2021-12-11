// ==UserScript==
// @name         www.dogdrip.net
// @version      20211209.1
// @match        https://www.dogdrip.net/*
// @grant        none
// ==/UserScript==

// 추천수 강조
for (const element of document.querySelectorAll('.voteNum')) {
	// 	element.parentElement.querySelector(".title").style.backgroundColor = `rgba(0,0,0,0.${(element.innerText).padStart(3,"0")})`
	element.parentElement.querySelector('.title').style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,${Math.tanh(element.innerText / 400) * 0.5}) 40%, rgba(0,0,0,0))`
}
