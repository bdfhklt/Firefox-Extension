// ==UserScript==
// @name         youtube.com watch
// @icon         https://www.youtube.com/s/desktop/592786db/img/favicon_144x144.png
// @version      1.0.2.20220630.0
// @downloadURL  http://localhost:5000/user-script?file-name=youtube.com-watch
// @match        https://www.youtube.com/*
// @grant        unsafeWindow
// ==/UserScript==

/* global unsafeWindow */

const Player = { // ! main 보다 위에 위치 !
	_player: null,
	get player () {
		if (!this._player) {
			return (async () => {
				// console.log('get player')
				const player = await findElementUsingInterval('#movie_player')
				if (player) {
					// console.log('find player')
					this._player = unsafeWindow.document.querySelector('#movie_player')
				}
				return this._player
			})()
		} else return this._player
	},

	State: {
		UNSTARTED: -1,
		ENDED: 0,
		PLAYING: 1,
		PAUSED: 2,
		BUFFERING: 3,
		CUED: 5
	},

	_controlHandle: null,
	get controlHandle () {
		if (!this._controlHandle) {
			// this._controlHandle = document.createElement('div')
			// this._controlHandle.style.position = 'fixed'
			// this._controlHandle.style.zIndex = '2147483647'
			// this._controlHandle.style.left = '50%'
			// this._controlHandle.style.bottom = '10%'
			// this._controlHandle.style.transform = 'translateX(-50%)'
			// this._controlHandle.style.width = '20px'
			// this._controlHandle.style.height = '20px'
			// this._controlHandle.style.backgroundColor = 'rgba(255,0,0,0.5)'
			// this._controlHandle.tabIndex = -1 // focusable => (addEventListener) event.target

			document.body.insertAdjacentHTML('beforeend', htmlControlHandle())
			this._controlHandle = document.querySelector('#control-handle')
			return this._controlHandle
		} else return this._controlHandle
	}
}


// main {
const pathnameMatch = location.pathname.match(/^\/[^/]*/)
if (pathnameMatch) {
	const test = !!0

	switch (pathnameMatch[0]) {
	case '/watch':
		disableAutoplay()
		break
	// case '/embed':
	// 	break
	default: {
		const observer = new MutationObserver((mutationList) => {
			if (mutationList[0].target.hidden === false) {
				observer.disconnect()
				disableAutoplay()
			}
		})
		;(async () => {
			const watchElement = await findElementUsingInterval('ytd-watch-flexy.style-scope')
			if (watchElement) observer.observe(watchElement, { attributeFilter: ['hidden'] })
		})()
	}	break
	}
	playerControl()

	if (test) {
		test1()
	}
}
// } main


async function test1 () {
	console.log('test start')

	const player = await Player.player

	// const watchElement = await findElementUsingInterval('ytd-watch-flexy.style-scope')
	// watchElement.append(Player.controlHandle)

	player.addEventListener('onStateChange', param => {
		console.log(param)
	})

	console.log('test end')
}


// 자동재생 해제
async function disableAutoplay () {
	const checkedButton = await findElementUsingInterval('.ytp-autonav-toggle-button[aria-checked="true"]', 2000, 5)
	if (checkedButton) checkedButton.click()
}

// 플레이어 컨트롤
async function playerControl () {
	const player = await Player.player
	if (!player) return

	const playerButtonTab = player.querySelector('.ytp-chrome-bottom')
	if (playerButtonTab) playerButtonTab.append(Player.controlHandle)

	// 글로벌 핫키 해제, 'onKey*Event_ = () => {}'에서 경고 콘솔 메시지 코드가 있음
	// unsafeWindow.document.querySelector('yt-hotkey-manager.style-scope').onKeyDownEvent_ = null
	// unsafeWindow.document.querySelector('yt-hotkey-manager.style-scope').onKeyUpEvent_ = null

	// Player.controlHandle.addEventListener('click', event => {
	// 	console.log(event)
	// })
	// Player.controlHandle.addEventListener('mousedown', event => {
	// 	console.log(event)
	// })
	// Player.controlHandle.addEventListener('mouseup', event => {
	// 	console.log(event)
	// })

	// keyboard shortcuts: https://support.google.com/youtube/answer/7631406?hl=ko
	Player.controlHandle.addEventListener('keydown', event => {
		// console.log(event)

		let keydown = true
		let messageText = null

		switch (event.code) {
		// 재생, 정지
		case 'Space':
			switch (player.getPlayerState()) {
			case Player.State.PLAYING: // 재생 중
				player.pauseVideo()
				messageText = '⏸'
				break
			case Player.State.PAUSED: // 일시중지
				player.playVideo()
				messageText = '▶'
				break
			}
			break

		// 탐색
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

		// 프레임 단위 탐색
		case 'Comma':
		case 'Period':
			if (player.getPlayerState() === Player.State.PLAYING) {
				player.pauseVideo()
			} else {
				keydown = false
			}
			break

		// 볼륨
		case 'ArrowUp':
			player.setVolume(player.getVolume() + 10)
			messageText = `${player.getVolume()}%`
			break
		case 'ArrowDown':
			player.setVolume(player.getVolume() - 10)
			messageText = `${player.getVolume()}%`
			break

		// 음소거
		// case 'KeyM':
		// 	if (player.isMuted()) {
		// 		player.unMute()
		// 	} else {
		// 		player.mute()
		// 	}
		// 	break

		// 재생 속도
		case 'NumpadAdd':
			if (player.getPlaybackRate() < 2) {
				const playbackRate = player.getPlaybackRate() === 0.25 ? 0.3 : player.getPlaybackRate() + 0.1
				player.setPlaybackRate(Math.round(playbackRate * 100) / 100)
			}
			// console.log(player.getPlaybackRate())
			messageText = `x${player.getPlaybackRate().toFixed(2)}`
			break
		case 'NumpadSubtract':
			if (player.getPlaybackRate() > 0.25) {
				const playbackRate = player.getPlaybackRate() === 0.25 ? 0.3 : player.getPlaybackRate() - 0.1
				player.setPlaybackRate(Math.round(playbackRate * 100) / 100)
			}
			// console.log(player.getPlaybackRate())
			messageText = `x${player.getPlaybackRate().toFixed(2)}`
			break
		case 'NumpadMultiply':
			player.setPlaybackRate(1.0)
			// console.log(player.getPlaybackRate())
			messageText = `x${player.getPlaybackRate().toFixed(2)}`
			break

		default:
			keydown = false
			break
		}
		if (keydown) {
			// event.stopImmediatePropagation()
			event.preventDefault()
		}
		if (messageText) top.postMessage({ id: 'gui-overlay-message', message: messageText }, '*')
	})
}


// await 사용 가능
function findElementUsingInterval (selector, timeout = 500, limit = 20) {
	let count = 0
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			count++
			const foundElement = document.querySelector(selector)
			if (foundElement) {
				clearInterval(interval)
				resolve(foundElement)
			}
			if (count >= limit) {
				clearInterval(interval)
				resolve(null)
			}
		}, timeout)
	})
}


function htmlControlHandle () {
	return `
<div
	id="control-handle"
	tabindex="-1"${'' /* focusable => (addEventListener) event.target */}
	style="
		position: absolute;
		z-index: 2147483647;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: solid 2px rgba(0, 255, 0, 0.25)
	"
>
	<style>
		#control-handle {
			background-color: rgba(255, 0, 0, 0.25);
		}
		#control-handle:focus {${'' /* focus, active 순서 중요 */}
			visibility: hidden;
		}
		#control-handle:active {
			visibility: visible;
			background-color: rgba(0, 255, 0, 0.25);
		}
	</style>
</div>
`
}

