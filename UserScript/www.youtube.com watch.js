// ==UserScript==
// @name         www.youtube.com watch
// @version      20210912.23
// @match        https://www.youtube.com/channel/*
// @match        https://www.youtube.com/c/*
// @match        https://www.youtube.com/watch?*
// @grant        unsafeWindow
// ==/UserScript==

const pathname = location.pathname.match(/^\/(channel\/|c\/|watch)/g)
if (pathname) {
	switch (location.pathname.match(/^\/(channel\/|c\/|watch)/)[0]) {
	case '/channel/':
	case '/c/': {
		const observer = new MutationObserver((mutationList) => {
			if (mutationList[0].target.hidden === false) {
				disableAutoplay()
				playerControl()
			}
		})
		waitElement('ytd-watch-flexy.style-scope', 500, 10, watchElement => {
			observer.observe(watchElement, { attributeFilter: ['hidden'] })
		})
	}
		break
	case '/watch':
		disableAutoplay()
		playerControl()
		break
	}
}


// 자동재생 해제
function disableAutoplay () {
	waitElement('.ytp-autonav-toggle-button[aria-checked="true"]', 2000, 5, checkedButton => {
		checkedButton.click()
	})
}

// 플레이어 컨트롤
function playerControl () {
	waitElement('#ytd-player', 500, 10, () => {
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
			// case 'ArrowUp':
			// 	player.setVolume(player.getVolume() + 20)
			// 	break
			// case 'ArrowDown':
			// 	player.setVolume(player.getVolume() - 20)
			// 	break
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
	})
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
