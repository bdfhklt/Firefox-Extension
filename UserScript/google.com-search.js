// ==UserScript==
// @name         private / google.com search
// @icon         https://www.google.com/favicon.ico
// @version      1.0.9.20240228.1
// @downloadURL  http://localhost:5000/user-script?file-name=google.com-search
// @match        https://www.google.com/*
// @grant        unsafeWindow
// @noframes
// ==/UserScript==

// Google USA 전환
if (location.pathname.startsWith('/search')) {
	(async () => {
		const searchButton = await findElementUsingInterval('button[aria-label]')
		if (searchButton !== null) {
			const searchInputBar = searchButton.parentElement.parentElement
			searchInputBar.insertAdjacentHTML('beforeend', htmlContent1())
			searchInputBar.querySelector('#switchButton').addEventListener('click', () => {
				const urlParams = new URLSearchParams(location.search)
				const urlParam1 = encodeURIComponent(urlParams.get('q'))
				if (urlParams.get('hl') === 'en') {
					location.href = `https://www.google.com/search?q=${urlParam1}`
				} else {
					location.href = `https://www.google.com/search?q=${urlParam1}&gl=us&hl=en&pws=0&gws_rd=cr`
				}
			})
		} else {
			console.log(`User Script Message: Not Found Element "${Object.keys({ searchButton })[0]}"`)
		}
	})()
}


// firefox; white space fix from google search bar textarea element
// CSS
document.head.appendChild(document.createElement('style')).innerHTML = (`
form[role='search'] textarea {
	white-space: break-spaces !important;
}
`
)



// 요소 찾기, await 사용 가능, v20220921
function findElementUsingInterval (selector, timeout = 500, timeoutCount = 20) {
	let count = 0
	return new Promise((resolve, reject) => {
		const foundElement = document.querySelector(selector)
		if (foundElement) {
			resolve(foundElement)
		} else {
			const interval = setInterval(() => {
				count++
				const foundElement = document.querySelector(selector)
				if (foundElement) {
					clearInterval(interval)
					resolve(foundElement)
				}
				if (count >= timeoutCount) {
					clearInterval(interval)
					console.log(`not found --> ${selector}`)
					resolve(null)
				}
			}, timeout)
		}
	})
}


function htmlContent1 (params) {
	return `
<div style="position: absolute; right: 0px; top: 50%; transform: translate(100%, -50%) translateX(20px);">
	<style>
		#switchButton {
			opacity: 0.2;
		}
		#switchButton:hover {
			opacity: 1;
		}
	</style>
	<button id="switchButton" type="button">Switch Google USA</button>
</div>
`
}
