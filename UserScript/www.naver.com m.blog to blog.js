// ==UserScript==
// @name         www.naver.com m.blog to blog
// @version      20210318.1
// @match        https://m.blog.naver.com/*
// @grant        none
// ==/UserScript==

// 네이버 블로그 모바일 -> PC
// location.href = location.href.replace('m.blog.naver.com', 'blog.naver.com')
window.location.replace(location.href.replace('m.blog.naver.com', 'blog.naver.com'))
