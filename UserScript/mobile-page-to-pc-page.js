// ==UserScript==
// @name         mobile page to pc page
// @version      1.0.1.20220621.0
// @downloadURL  http://localhost:5000/user-script?file-name=mobile-page-to-pc-page
// @match        https://m.blog.naver.com/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

switch (location.hostname) {
case 'm.blog.naver.com': // 네이버 블로그 모바일
	// location.href = location.href.replace('m.blog.naver.com', 'blog.naver.com')
	location.replace(location.href.replace('m.blog.naver.com', 'blog.naver.com'))
	break
}
