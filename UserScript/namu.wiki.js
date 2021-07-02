// ==UserScript==
// @name         namu.wiki
// @version      20210701.13
// @match        https://namu.wiki/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

// 사이드바 비활성, 고정폭 1000px
if (!localStorage.theseed_settings) {
	localStorage.theseed_settings = '{"senkawa.fixed_body":"1000","senkawa.hide_sidebar":true}'
	console.log('local storage loaded')
}
