// ==UserScript==
// @name         public / youtube.com watch
// @icon         https://www.youtube.com/s/desktop/592786db/img/favicon_144x144.png
// @version      1.0.14.20250501.0
// @downloadURL  http://localhost:5000/user-script?file-name=youtube.com-watch
// @match        https://www.youtube.com/*
// @grant        unsafeWindow
// @grant        window.close
// ==/UserScript==

/* global unsafeWindow */

// element id, class name
const USERSCRIPT_ID = 'userscript-youtube'
const AUTO_CLOSE_CHECKBOX_CONTAINER = 'auto-close-checkbox-container'
const CONTROL_KNOB_CONTAINER = 'control-knob-container'
// const CONTROL_CHECKBOX_CONTAINER = 'control-checkbox-container'


const Player = {
	_player: null,
	get player () {
		return (async () => {
			if (!this._player) {
				// console.log('get player')
				const player = await findElementUsingInterval('#movie_player')
				if (player) {
					// console.log('find player')
					this._player = unsafeWindow.document.querySelector('#movie_player')
				}
			}
			return this._player
		})()
	},

	State: {
		UNSTARTED: -1,
		ENDED: 0,
		PLAYING: 1,
		PAUSED: 2,
		BUFFERING: 3,
		CUED: 5
	},

	_controlKnob: null,
	get controlKnob () {
		if (!this._controlKnob) {
			// this._controlKnob = document.createElement('div')
			// this._controlKnob.style.position = 'fixed'
			// this._controlKnob.style.zIndex = '2147483647'
			// this._controlKnob.style.left = '50%'
			// this._controlKnob.style.bottom = '10%'
			// this._controlKnob.style.transform = 'translateX(-50%)'
			// this._controlKnob.style.width = '20px'
			// this._controlKnob.style.height = '20px'
			// this._controlKnob.style.backgroundColor = 'rgba(255,0,0,0.5)'
			// this._controlKnob.tabIndex = -1 // focusable => (addEventListener) event.target

			// document.body.insertAdjacentHTML('beforeend', htmlControlKnob())
			// this._controlKnob = document.querySelector('#control-knob')

			const knobContainer = document.createElement('div')
			const knob = document.createElement('div')

			knob.tabIndex = -1

			knobContainer.classList.add(CONTROL_KNOB_CONTAINER)
			knobContainer.id = USERSCRIPT_ID

			knobContainer.append(knob)

			// CSS
			document.head.appendChild(document.createElement('style')).innerHTML = (`
#${USERSCRIPT_ID}.${CONTROL_KNOB_CONTAINER} {
	position: absolute;
	z-index: 2147483647;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
#${USERSCRIPT_ID}.${CONTROL_KNOB_CONTAINER} > div {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: solid 2px rgba(0, 255, 0, 0.25);
	background-clip: padding-box;
	background-color: rgba(255, 0, 0, 0.25);
}
#${USERSCRIPT_ID}.${CONTROL_KNOB_CONTAINER} > div:focus {${'' /* focus, active 순서 중요, visiable: hidden --> focus를 잃음 */}
	background-color: rgba(0, 255, 255, 0.05);
}
#${USERSCRIPT_ID}.${CONTROL_KNOB_CONTAINER} > div:active {
	background-color: rgba(0, 255, 0, 0.25);
}
`
			)

			this._controlKnob = knobContainer
		}
		return this._controlKnob
	}
	// _controlCheckbox: null,
	// get controlCheckbox () {
	// 	if (!this._controlCheckbox) {
	// 		this._controlCheckbox = document.querySelector(`#${USERSCRIPT_ID}. ${CONTROL_CHECKBOX_CONTAINER} input[type="checkbox"]`)
	// 	}
	// 	return this._controlCheckbox
	// }
}


// main {
const pathnameMatch = location.pathname.match(/^\/[^/]*/)
if (pathnameMatch) {
	const test = Boolean(0)

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
	hideViewMorePopup()
	playerControl()
	createAutoCloseCheckbox()

	if (test) {
		test1()
	}
}
// } main


// 사용법: nameof(() => vailableName)
function nameof (object) {
	return object.toString().split(' ').pop()
}


async function test1 () {
	console.log('test start')

	const player = await Player.player

	// const watchElement = await findElementUsingInterval('ytd-watch-flexy.style-scope')
	// watchElement.append(Player.controlKnob)

	player.addEventListener('onStateChange', param => {
		console.log(param)
	})

	console.log('test end')
}


// 자동재생 해제
function disableAutoplay () {
	setTimeout(async () => {
		const checkedButton = await findElementUsingInterval('.ytp-autonav-toggle-button[aria-checked="true"]', 6000, 10)
		if (checkedButton) {
			checkedButton.click()
			console.log(nameof(() => disableAutoplay))
		}
	}, 5000)
}

// 동영상 더보기 숨기기
async function hideViewMorePopup () {
	const hideButton = await findElementUsingInterval('button[aria-label="동영상 더보기 숨기기"]')
	if (hideButton) {
		hideButton.click()
		console.log(nameof(() => hideViewMorePopup))
	}
}

// 재생 후 자동 닫기 체크박스 생성
async function createAutoCloseCheckbox () {
	const checkboxContainer = document.createElement('div')
	const checkboxBlock = document.createElement('div')
	const checkboxLabel = document.createElement('label')
	const checkbox = document.createElement('input')

	checkboxLabel.textContent = 'auto close'
	checkbox.type = 'checkbox'

	checkboxContainer.classList.add(AUTO_CLOSE_CHECKBOX_CONTAINER)
	checkboxContainer.id = USERSCRIPT_ID

	checkboxContainer.append(checkboxBlock)
	checkboxBlock.append(checkboxLabel, checkbox)
	const element1 = await findElementUsingInterval('#below', 2000, 1800)
	if (element1) element1.prepend(checkboxContainer)

	// CSS
	document.head.appendChild(document.createElement('style')).innerHTML = (`
#${USERSCRIPT_ID}.${AUTO_CLOSE_CHECKBOX_CONTAINER} {
	position: relative;
}
#${USERSCRIPT_ID}.${AUTO_CLOSE_CHECKBOX_CONTAINER} > div {
	position: absolute;
	right: 0;
	background-color: white;
	transition-property: opacity;
	transition-duration: 0.4s;
	opacity: 0;
}
#${USERSCRIPT_ID}.${AUTO_CLOSE_CHECKBOX_CONTAINER} > div:hover {
	opacity: 1;
}
#${USERSCRIPT_ID}.${AUTO_CLOSE_CHECKBOX_CONTAINER} label {
	font-size: medium;
}
`
	)


	const player = await Player.player
	if (!player) return

	player.addEventListener('onStateChange', (event) => {
		// console.log(event)
		if (event === Player.State.ENDED) {
			const checkbox = document.querySelector(`#${USERSCRIPT_ID}.${AUTO_CLOSE_CHECKBOX_CONTAINER} input[type="checkbox"]`)
			if (checkbox && checkbox.checked) {
				window.close()
			}
		}
	})
}

// 플레이어 컨트롤
async function playerControl () {
	const player = await Player.player
	if (!player) return

	const playerButtonTab = player.querySelector('.ytp-chrome-bottom')
	if (playerButtonTab) playerButtonTab.append(Player.controlKnob)


	// 컨트롤 체크박스 생성
// 	const checkboxContainer = document.createElement('div')
// 	const checkboxBlock = document.createElement('div')
// 	const checkboxLabel = document.createElement('label')
// 	const checkbox = document.createElement('input')

// 	checkboxContainer.tabIndex = -1
// 	checkboxLabel.textContent = 'custom control'
// 	checkbox.type = 'checkbox'

// 	checkboxContainer.classList.add(CONTROL_CHECKBOX_CONTAINER)
// 	checkboxContainer.id = USERSCRIPT_ID

// 	checkboxContainer.append(checkboxBlock)
// 	checkboxBlock.append(checkboxLabel, checkbox)
// 	const playerButtonTab = player.querySelector('.ytp-chrome-bottom')
// 	if (playerButtonTab) playerButtonTab.append(checkboxContainer)

// 	// CSS
// 	document.head.appendChild(document.createElement('style')).innerHTML = (`
// #${USERSCRIPT_ID}.${CONTROL_CHECKBOX_CONTAINER} {
// 	position: absolute;
// 	z-index: 2147483647;
// 	left: 50%;
// 	top: 50%;
// 	transform: translate(-50%, -50%);
// }
// #${USERSCRIPT_ID}.${CONTROL_CHECKBOX_CONTAINER} label {
// 	font-size: small;
// }
// `
// 	)


	// 글로벌 핫키 해제, 'onKey*Event_ = () => {}'에서 경고 콘솔 메시지 코드가 있음
	// unsafeWindow.document.querySelector('yt-hotkey-manager.style-scope').onKeyDownEvent_ = null
	// unsafeWindow.document.querySelector('yt-hotkey-manager.style-scope').onKeyUpEvent_ = null

	// Player.controlKnob.addEventListener('click', event => {
	// 	console.log(event)
	// })
	// Player.controlKnob.addEventListener('mousedown', event => {
	// 	console.log(event)
	// })
	// Player.controlKnob.addEventListener('mouseup', event => {
	// 	console.log(event)
	// })

	// keyboard shortcuts: https://support.google.com/youtube/answer/7631406?hl=ko
	function keyEventProcess (event) {
		if (Player.controlCheckbox && !Player.controlCheckbox.checked) return

		let keyEvent = true
		let messageText = null

		// ! 화질 설정 api는 2019년 지원 종료로 사용 불가 상태 !
		function setVideoQuality (nextOrPrev) {
			const focusedElement = document.activeElement

			player.querySelector('.ytp-settings-button').click()
			Array.from(player.querySelectorAll('.ytp-menuitem')).find(el => el.innerText.includes('화질')).click()
			const currentButton = player.querySelector('.ytp-quality-menu .ytp-menuitem[aria-checked=true]')

			let nextOrPrevButton
			switch (nextOrPrev) {
			case 'prev':
				nextOrPrevButton = currentButton.previousSibling
				break
			case 'next':
				nextOrPrevButton = currentButton.nextSibling
				break
			}

			if (nextOrPrevButton) {
				nextOrPrevButton.click()
				messageText = nextOrPrevButton.innerText
			} else {
				currentButton.click()
				messageText = currentButton.innerText
			}

			focusedElement.focus()
		}

		if (event.type === 'keydown') {
			switch (event.code) {
			// 재생, 정지. 길게 누르면 2배 재생 기능 추가되면서 기본 기능은 keyup event로 변경 됨; keyup event에서 무효화
			case 'Space':
				if (event.repeat) break

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

			// 탐색. keyup event 추가 됨; keyup event에서 무효화
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
					keyEvent = false
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

			// 화질
			case 'BracketLeft':
				setVideoQuality('next')
				break
			case 'BracketRight':
				setVideoQuality('prev')
				break

			default:
				keyEvent = false
				break
			}
		} else if (event.type === 'keyup') {
			switch (event.code) {
			// 재생, 정지. keyup event 무효화
			case 'Space':
				break

			// 탐색. keyup event 무효화
			case 'ArrowLeft':
				break
			case 'ArrowRight':
				break

			default:
				keyEvent = false
				break
			}
		}

		if (keyEvent) {
			event.stopImmediatePropagation()
			event.preventDefault()
		}

		if (messageText) top.postMessage({ id: 'gui-overlay-message', message: messageText }, '*')
	}

	Player.controlKnob.addEventListener('keydown', event => {
		// console.log(event)
		keyEventProcess(event)
	})
	Player.controlKnob.addEventListener('keyup', event => {
		// console.log(event)
		keyEventProcess(event)
	})
}


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


// function htmlControlKnob () {
// 	return `
// <div
// 	id="control-knob"
// 	tabindex="-1"${'' /* focusable => (addEventListener) event.target */}
// 	style="
// 		position: absolute;
// 		z-index: 2147483647;
// 		left: 50%;
// 		top: 50%;
// 		transform: translate(-50%, -50%);
// 		width: 20px;
// 		height: 20px;
// 		border-radius: 50%;
// 		border: solid 2px rgba(0, 255, 0, 0.25)
// 	"
// >
// 	<style>
// 		#control-knob {
// 			background-color: rgba(255, 0, 0, 0.25);
// 		}
// 		#control-knob:focus {${'' /* focus, active 순서 중요 */}
// 			visibility: hidden;
// 		}
// 		#control-knob:active {
// 			visibility: visible;
// 			background-color: rgba(0, 255, 0, 0.25);
// 		}
// 	</style>
// </div>
// `
// }
