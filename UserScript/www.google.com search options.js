// ==UserScript==
// @name         www.google.com search options
// @version      20210430.6
// @match        https://www.google.com/search?*
// @match        https://www.google.com/preferences?*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

// 영어 검색 최적화: 검색 설정에서 지역 변경
switch (window.location.pathname) {
case '/search':
	document.addEventListener('DOMContentLoaded', () => {
		let temp1 = document.querySelector('.Q8LRLc')
		console.log(temp1)
		if (!temp1) { // null = 미국
			if (!GM_getValue('bypass enabled', true)) {
				gotoPreferencesPage()
			} else {
				temp1 = document.querySelector('#Wprf1b')
				if (temp1) {
					temp1.addEventListener('click', () => {
						GM_setValue('bypass enabled', false)
						gotoPreferencesPage()
					})
				}
			}
		} else if (temp1.textContent === '대한민국') {
			if (GM_getValue('bypass enabled', true)) {
				gotoPreferencesPage()
			} else {
				temp1.addEventListener('click', () => {
					GM_setValue('bypass enabled', true)
					gotoPreferencesPage()
				})
			}
		} else {
			gotoPreferencesPage()
		}

		function gotoPreferencesPage () {
			document.querySelector('#abar_button_opt').removeAttribute('href') // 페이지 이동 방지
			document.querySelector('#abar_button_opt').click()
			let count1 = 0
			const interval1 = setInterval(() => {
				count1++
				if (count1 >= 40) {
					clearInterval(interval1)
				}
				let temp2 = document.querySelector('#lb > div:nth-child(1) > g-menu:nth-child(1) > g-menu-item:nth-child(1) > div:nth-child(1) > a:nth-child(1)') // 검색 환경설정 버튼
				if (temp2) {
					clearInterval(interval1)
					temp2.click() // 검색 설정 페이지로 이동
				}
			}, 200)
		}
	})
	break
case '/preferences': {
	unsafeWindow.alert = () => {} // alert() 제거
	let count1 = 0
	let interval1 = setInterval(() => {
		count1++
		if (count1 >= 40) {
			clearInterval(interval1)
		}
		let temp1 = document.querySelector('input[name=gl]') // 지역 선택 옵션
		if (temp1) {
			clearInterval(interval1)
			if (GM_getValue('bypass enabled', true)) {
				temp1.value = 'US' // 미국
			} else {
				temp1.value = 'KR' // 대한민국
			}
			let interval2 = setInterval(() => {
				let temp2 = document.querySelector('.goog-inline-block.jfk-button.jfk-button-action')
				if (temp2) {
					clearInterval(interval2)
				}
				temp2.dispatchEvent(new KeyboardEvent('keypress', { keyCode: 13 })) // ['keydown', 'click'] 안됨, {keyCode: 13} = Enter
			}, 200)
		}
	}, 200)
} break
}
