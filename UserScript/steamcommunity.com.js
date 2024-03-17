// ==UserScript==
// @name         public / steamcommunity.com
// @icon         https://steamcommunity.com/favicon.ico
// @version      1.0.0.20221031.1
// @downloadURL  http://localhost:5000/user-script?file-name=steamcommunity.com
// @match        https://steamcommunity.com/*
// @grant        none
// @noframes
// ==/UserScript==

// CSS
// 창작마당 페이지
if (location.pathname.startsWith('/workshop/browse')) {
	document.head.appendChild(document.createElement('style')).innerHTML = `
.workshopItemTitle.ellipsis {
	white-space: break-spaces;
}
`
}
