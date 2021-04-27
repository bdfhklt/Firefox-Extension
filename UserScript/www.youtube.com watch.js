// ==UserScript==
// @name         www.youtube.com watch
// @version      20210319.1
// @match        https://www.youtube.com/watch?*
// @grant        unsafeWindow
// ==/UserScript==

// 자동재생 해제
let count1 = 0
const interval1 = setInterval(() => {
	count1++
	let tmp1 = document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]')
	if (tmp1) {
		clearInterval(interval1)
		tmp1.click()
	}
	if (count1 >= 4) {
		clearInterval(interval1)
	}
}, 1000)

// 로그인 권유 창 제거
// let count2 = 0
// let interval2 = setInterval(() => {
//   count2++
//   let temp1 = document.querySelector('paper-button.style-light-text')
//   if (temp1) {
//     temp1.click()
//     clearInterval(interval2)
//   }
//   if (count2 >= 4) {
//     clearInterval(interval2)
//   }
// }, 1000)

// 플레이어 컨트롤
setTimeout(() => {
	const player = unsafeWindow.document.querySelector('#ytd-player').player_
	// const playerSettingsButton = document.querySelector('.ytp-button.ytp-settings-button')
	// let activated = false
	// let settimeout1

	// 글로벌 핫키 해제, '= () => {}'에서 경고 콘솔 메시지 코드가 있음
	unsafeWindow.document.querySelector('yt-hotkey-manager.style-scope').onKeyDownEvent_ = null
	unsafeWindow.document.querySelector('yt-hotkey-manager.style-scope').onKeyUpEvent_ = null

	document.body.addEventListener('keydown', (event) => {
		if (event.target.id === 'movie_player' || event.target.tagName.toLowerCase() === 'input') {
			return
		}
		let keyDownCheck = true
		switch (event.key) {
		case ' ':
			switch (player.getPlayerState()) {
			case 1: // 재생 중
				player.pauseVideo()
				break
			case 2: // 일시중지
				player.playVideo()
				break
			}
			break
		case 'ArrowLeft':
			if (event.shiftKey) {
				player.seekTo(player.getCurrentTime() - 20)
			} else if (event.ctrlKey) {
				player.seekTo(player.getCurrentTime() - 5)
			} else {
				player.seekTo(player.getCurrentTime() - 1)
			}
			break
		case 'ArrowRight':
			if (event.shiftKey) {
				player.seekTo(player.getCurrentTime() + 20)
			} else if (event.ctrlKey) {
				player.seekTo(player.getCurrentTime() + 5)
			} else {
				player.seekTo(player.getCurrentTime() + 1)
			}
			break
		case 'ArrowUp':
			player.setVolume(player.getVolume() + 20)
			break
		case 'ArrowDown':
			player.setVolume(player.getVolume() - 20)
			break
		case 'm':
			if (player.isMuted()) {
				player.unMute()
			} else {
				player.mute()
			}
			break
		case '+':
			player.setPlaybackRate((Math.round(player.getPlaybackRate() * 10) / 10) + 0.1)
			break
		case '-':
			player.setPlaybackRate((Math.round(player.getPlaybackRate() * 10) / 10) - 0.1)
			break
		default:
			keyDownCheck = false
			break
		}
		if (keyDownCheck) {
			// event.stopImmediatePropagation()
			event.preventDefault()

			// if (!activated) {
			// 	playerSettingsButton.click()
			// }
			// activated = true
			// clearTimeout(settimeout1)
			// settimeout1 = setTimeout(() => {
			// 	if (activated) {
			// 		activated = false
			// 		playerSettingsButton.click()
			// 	}
			// }, 1000)
		}
	})
}, 2000)
