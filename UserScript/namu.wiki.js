// ==UserScript==
// @name         namu.wiki
// @version      20210318.1
// @match        https://namu.wiki/*
// @grant        none
// ==/UserScript==

// 사이드바 비활성, 고정폭 1000px
let tmp1 = document.querySelector('.app').classList
tmp1.remove('senkawa-fixed-1300')
tmp1.add('senkawa-fixed-1000', 'senkawa-hide-sidebar')
