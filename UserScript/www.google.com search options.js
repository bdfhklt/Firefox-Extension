// ==UserScript==
// @name         www.google.com search options
// @version      20210720.1
// @match        https://www.google.com/search?*
// @match        https://www.google.com/preferences?*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

// 영어 검색 최적화: 검색 설정에서 지역 변경
switch (location.pathname) {
case '/search':
	document.addEventListener('DOMContentLoaded', () => {
		let locationName = document.querySelector('.Q8LRLc')
		if (locationName) {
			if (locationName.textContent === '대한민국') {
				locationName.addEventListener('click', () => {
					gotoPreferencesPage()
				})
			}
		} else { // null = 외국
			locationName = document.querySelector('#Wprf1b')
			if (locationName) {
				locationName.addEventListener('click', () => {
					gotoPreferencesPage()
				})
			}
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
				const gotoPreferencesPageButton = document.querySelector('#lb > div:nth-child(1) > g-menu:nth-child(1) > g-menu-item:nth-child(1) > div:nth-child(1) > a:nth-child(1)') // 검색 환경설정 버튼
				if (gotoPreferencesPageButton) {
					clearInterval(interval1)
					gotoPreferencesPageButton.click() // 검색 설정 페이지로 이동
				}
			}, 200)
		}
	})
	break

case '/preferences': {
	unsafeWindow.alert = () => {} // alert() 제거
	let count1 = 0
	const interval1 = setInterval(() => {
		count1++
		if (count1 >= 40) {
			clearInterval(interval1)
		}
		const optionInput = document.querySelector('input[name=gl]') // 지역 선택 옵션
		if (optionInput) {
			clearInterval(interval1)
			if (optionInput.value === 'KR' || optionInput.value === 'ZZ') { // 'ZZ' = 현재 지역
				optionInput.value = 'US' // 미국
			} else {
				optionInput.value = 'KR' // 대한민국
			}
			const interval2 = setInterval(() => {
				const saveButton = document.querySelector('#form-buttons .jfk-button-action')
				if (saveButton) {
					clearInterval(interval2)
				}
				saveButton.dispatchEvent(new KeyboardEvent('keypress', { keyCode: 13 })) // ['keydown', 'click'] 안됨, {keyCode: 13} = Enter
			}, 200)
		}
	}, 200)
} break
}
