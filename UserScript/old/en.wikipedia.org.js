// ==UserScript==
// @name         en.wikipedia.org
// @icon         https://en.wikipedia.org/static/favicon/wikipedia.ico
// @version      1.0.2.20220708.2
// @downloadURL  http://localhost:5000/user-script?file-name=en.wikipedia.org
// @match        https://en.wikipedia.org/*
// @grant        none
// @noframes
// ==/UserScript==

const contentWidth = '1000px'

// CSS 설정, 페이지 컨텐트 너비 조절
document.head.appendChild(document.createElement('style')).innerHTML =
`body>:is(#content, #footer) {
	max-width: ${contentWidth};
	margin-left: max(176px, (100% - ${contentWidth}) / 2);
}
body>#mw-navigation {
	position: absolute;
	top: 0px;
	left: 50%;
	width: 100%;
	max-width: calc(${contentWidth} + ((176px) * 2));
	transform: translateX(-50%);
}`
