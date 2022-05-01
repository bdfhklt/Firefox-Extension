// ==UserScript==
// @name         www.google.com search options
// @version      20210912.1
// @match        https://www.google.com/search?*
// @match        https://www.google.com/preferences?*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

// 영어 검색 최적화: 검색 설정에서 지역 변경
switch (location.pathname) {
case '/search':
	document.addEventListener('DOMContentLoaded', () => {
		const currentRegionRow = document.querySelector('.b0KoTc')
		if (currentRegionRow) {
			currentRegionRow.insertAdjacentHTML('afterbegin', '<button id="switchButton" type="button" style="position: absolute; top: -10px; opacity: 0.2;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.2">Switch Region</button>')
			currentRegionRow.querySelector('#switchButton').addEventListener('click', () => {
				const gotoPreferencesPageButton = document.querySelector('a[href^="/preferences?"]')
				if (gotoPreferencesPageButton) {
					gotoPreferencesPageButton.click() // 검색 설정 페이지로 이동
				} else {
					console.log('User Script Message: Not Found Element(gotoPreferencesPageButton)')
				}
			})
		} else {
			console.log('User Script Message: Not Found Element(currentRegionRow)')
		}
	})
	break

case '/preferences': {
	unsafeWindow.alert = () => {} // alert() 제거
	waitElement('input[name=gl]', 50, 100, optionInput => { // 지역 선택 옵션
		if (optionInput.value === 'KR' || optionInput.value === 'ZZ') { // 'ZZ' = 현재 지역
			optionInput.value = 'US' // 미국
		} else {
			optionInput.value = 'KR' // 대한민국
		}
		waitElement('#form-buttons .jfk-button-action', 50, 100, saveButton => {
			saveButton.dispatchEvent(new KeyboardEvent('keypress', { keyCode: 13 })) // ['keydown', 'click'] 안됨, {keyCode: 13} = Enter
		})
	})

	break }
}


function waitElement (selector, timeout, limit, callback) {
	let count = 0
	const interval = setInterval(() => {
		count++
		const element = document.querySelector(selector)
		if (element) {
			clearInterval(interval)
			return callback(element)
		}
		if (count >= limit) {
			clearInterval(interval)
		}
	}, timeout)
}
