// ==UserScript==
// @name         en.wikipedia.org
// @version      1.0.1.20220621.1
// @downloadURL  http://localhost:5000/user-script?file-name=en.wikipedia.org
// @match        https://en.wikipedia.org/*
// @grant        none
// @noframes
// ==/UserScript==

// 페이지 폭 조정
let tmp1 = document.body.style
tmp1.maxWidth = '1400px'
tmp1.position = 'relative'
tmp1.margin = '0px auto'
tmp1 = document.querySelector('.mw-body').style
tmp1.margin = '0px auto'
tmp1.maxWidth = '1000px'
document.querySelector('footer').style.margin = '0px 160px'
