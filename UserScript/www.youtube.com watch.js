// ==UserScript==
// @name         www.youtube.com watch
// @version      20220113.36
// @match        https://www.youtube.com/*
// @grant        unsafeWindow
// ==/UserScript==

const Player = {
	_player: null,
	get player () {
		if (!this._player) {
			return (async () => {
				if (await findElementUsingInterval('#movie_player')) {
					this._player = unsafeWindow.document.querySelector('#movie_player')
				}
				return this._player
			})()
		} else return this._player
	},

	PlayerState: {
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


// main
const pathnameMatch = location.pathname.match(/^\/[^/]*/)
if (pathnameMatch) {
	switch (pathnameMatch[0]) {
	case '/watch':
		disableAutoplay()
		playerControl()
		test1()
		break
	case '/embed':
		playerControl()
		test1()
		break
	default: {
		const observer = new MutationObserver((mutationList) => {
			if (mutationList[0].target.hidden === false) {
				observer.disconnect()
				disableAutoplay()
				playerControl()
			}
		})
		test1()
		;(async () => {
			observer.observe(await findElementUsingInterval('ytd-watch-flexy.style-scope'), { attributeFilter: ['hidden'] })
		})()
	}
		break
	}
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

	player.append(Player.controlHandle)

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
	Player.controlHandle.addEventListener('keydown', event => {
		// console.log(event)

		let keyDownCheck = true
		switch (event.code) {
		case 'Space':
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
		case 'KeyM':
			if (player.isMuted()) {
				player.unMute()
			} else {
				player.mute()
			}
			break
		case 'NumpadAdd':
			player.setPlaybackRate((Math.round(player.getPlaybackRate() * 10) / 10) + 0.1)
			break
		case 'NumpadSubtract':
			player.setPlaybackRate((Math.round(player.getPlaybackRate() * 10) / 10) - 0.1)
			break
		case 'NumpadMultiply':
			player.setPlaybackRate(1.0)
			break

		default:
			keyDownCheck = false
			break
		}

		if (keyDownCheck) {
			// event.stopImmediatePropagation()
			event.preventDefault()
		}
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
	style="
		position: fixed;
		z-index: 2147483647;
		left: 50%;
		bottom: 10%;
		transform: translateX(-50%);
		width: 20px;
		height: 20px;
	"
	tabindex="-1"${'' /* focusable => (addEventListener) event.target */}
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

