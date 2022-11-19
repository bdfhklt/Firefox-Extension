// ==UserScript==
// @name         video control
// @version      1.1.3.20221119.111
// @downloadURL  http://localhost:5000/user-script?file-name=video-control
// @include      *
// @grant        none
// ==/UserScript==

const CONSTROL_DELAY = 50 // 웹사이트의 비디오 플레이어 제어 충돌 방지

// element id, class name
const USERSCRIPT_ID = 'userscript-video-control'
const VIDEO_OVERLAY = 'video-overlay'
const VIDEO_PROGRESS = 'video-progress'


// v20221119
// element.offsetXXXX --> 정수로 반올림된 값
function getOffset (element, valueType) {
	let result

	switch (valueType) {
	case 'left':
		// result = element.offsetLeft
		break
	case 'right':
		// result = element.offsetRight
		break
	case 'top':
		// result = element.offsetTop
		break
	case 'bottom':
		// result = element.offsetBottom
		break
	default:
		return 0
	}
	// if (result === 0) return 0

	// const value1 = element.getBoundingClientRect()[valueType]
	// let value2
	// let target = element
	// do {
	// 	target = target.parentElement
	// 	value2 = target.getBoundingClientRect()[valueType]
	// 	result = value1 - value2
	// } while (target.parentElement && result === 0)

	if (element.offsetParent === document.body) {
		result = element.getBoundingClientRect()[valueType] - document.documentElement.getBoundingClientRect()[valueType]
	} else {
		result = element.getBoundingClientRect()[valueType] - element.offsetParent.getBoundingClientRect()[valueType]
	}

	return Math.abs(result)
}


class VideoObj {
	constructor (videoElement) {
		this.videoElement = videoElement
	}

	addVideoControl () {
		console.log(this.addVideoControl.name)

		const videoElement = this.videoElement

		// 이벤트 제거
		// const tempElement = videoElement.cloneNode(true)
		// videoElement.parentNode.replaceChild(tempElement, videoElement)
		// videoElement.remove()
		// videoElement = tempElement

		// 중복 방지, querySelector('video:not([data-video-control])')
		// videoElement.dataset.videoControl = true

		// 컨트롤 표시
		videoElement.controls = true

		// 커스텀 컨트롤
		// videoElement.insertAdjacentHTML('afterend', htmlVideoControls())
		// const videoContainer = videoElement.parentElement.querySelector('#temp-id')
		// videoContainer.removeAttribute('id')
		// videoContainer.prepend(videoElement)
		// videoContainer.style.position = getComputedStyle(videoElement).position

		// 테스트, [click, mousedown, mouseup]: firefox의 비디오 컨트롤에서 이벤트 감지 불가
		// videoElement.addEventListener('click', event => {
		// 	console.log(event)
		// })
		// videoElement.addEventListener('mousedown', event => {
		// 	console.log(event)
		// })
		// videoElement.addEventListener('mouseup', event => {
		// 	console.log(event)
		// })

		videoElement.muted = false

		// 핫키, 제어
		// keyboard shortcuts: https://support.mozilla.org/en-US/kb/html5-audio-and-video-firefox
		videoElement.addEventListener('keydown', event => {
			// console.log(event)

			let keydown = true
			let messageText = null
			const state = {
				paused: videoElement.paused,
				currentTime: videoElement.currentTime,
				volume: videoElement.volume
			}

			let delayedProcess

			switch (event.code) {
			// 재생, 정지
			case 'Space':
				if (state.paused) {
					delayedProcess = () => {
						if (videoElement.currentTime === videoElement.duration) {
							videoElement.currentTime = 0
						}
						videoElement.play()
					}
					messageText = '▶'
				} else {
					delayedProcess = () => videoElement.pause()
					messageText = '⏸'
				}
				break

			// 탐색
			case 'ArrowLeft':
				if (event.shiftKey) {
					delayedProcess = () => { videoElement.currentTime = state.currentTime - 20 }
				} else if (event.ctrlKey) {
					delayedProcess = () => { videoElement.currentTime = state.currentTime - 5 }
				} else {
					delayedProcess = () => { videoElement.currentTime = state.currentTime - 1 }
				}
				break
			case 'ArrowRight':
				if (event.shiftKey) {
					delayedProcess = () => { videoElement.currentTime = state.currentTime + 20 }
				} else if (event.ctrlKey) {
					delayedProcess = () => { videoElement.currentTime = state.currentTime + 5 }
				} else {
					delayedProcess = () => { videoElement.currentTime = state.currentTime + 1 }
				}
				break

			// 정밀 탐색, 60fps
			case 'Comma':
				if (videoElement.paused) {
					videoElement.currentTime -= 1 / 60
				} else {
					videoElement.pause()
				}
				break
			case 'Period':
				if (videoElement.paused) {
					videoElement.currentTime += 1 / 60
				} else {
					videoElement.pause()
				}
				break

			// 특정 지점 탐색
			case 'Home':
				videoElement.currentTime = 0
				messageText = '⏮'
				break
			case 'End':
				if (!videoElement.paused) videoElement.pause()
				videoElement.currentTime = videoElement.duration
				messageText = '⏭'
				break

			// 볼륨
			case 'ArrowUp':
				if (state.volume < 1.0) {
					delayedProcess = () => {
						videoElement.volume = Math.round((state.volume + 0.1) * 10) / 10
						messageText = `${videoElement.volume * 100}%`
					}
				} else messageText = `${videoElement.volume * 100}%`
				// console.log(videoElement.volume)
				break
			case 'ArrowDown':
				if (state.volume > 0) {
					delayedProcess = () => {
						videoElement.volume = Math.round((state.volume - 0.1) * 10) / 10
						messageText = `${videoElement.volume * 100}%`
					}
				} else messageText = `${videoElement.volume * 100}%`
				// console.log(videoElement.volume)
				break

			// 음소거
			case 'KeyM':
				videoElement.muted = !videoElement.muted
				if (videoElement.muted) {
					messageText = '🔇'
				} else {
					messageText = `${videoElement.volume * 100}%`
				}
				break

			// 재생 속도
			case 'NumpadAdd':
				if (videoElement.playbackRate < 4) { // 4.0 초과: 소리가 안남
					const playbackRate = videoElement.playbackRate === 0.25 ? 0.3 : videoElement.playbackRate + 0.1
					videoElement.playbackRate = (Math.round(playbackRate * 100) / 100)
				}
				// console.log(videoElement.playbackRate)
				messageText = `x${videoElement.playbackRate.toFixed(2)}`
				break
			case 'NumpadSubtract':
				if (videoElement.playbackRate > 0.25) { // 0.25 미만: 소리가 안남
					const playbackRate = videoElement.playbackRate === 0.3 ? 0.25 : videoElement.playbackRate - 0.1
					videoElement.playbackRate = (Math.round(playbackRate * 100) / 100)
				}
				// console.log(videoElement.playbackRate)
				messageText = `x${videoElement.playbackRate.toFixed(2)}`
				break
			case 'NumpadMultiply':
				videoElement.playbackRate = videoElement.defaultPlaybackRate
				// console.log(videoElement.playbackRate)
				messageText = `x${videoElement.playbackRate.toFixed(2)}`
				break

			// 컨트롤
			case 'KeyC':
				videoElement.controls = !videoElement.controls
				break

			// 반복
			case 'KeyL':
				videoElement.loop = !videoElement.loop
				break

			default:
				keydown = false
				break
			}
			if (keydown) {
				// console.log('keydown')
				event.preventDefault()
			}
			const postMessage = () => { if (messageText) top.postMessage({ id: 'gui-overlay-message', message: messageText }, '*') }
			if (delayedProcess) {
				setTimeout(() => {
					delayedProcess()
					postMessage()
				}, CONSTROL_DELAY)
			} else {
				postMessage()
			}
		})
	}

	addVideoOverlay () {
		const videoOverlay = document.createElement('div')
		const videoProgress = document.createElement('progress')

		videoOverlay.id = USERSCRIPT_ID
		videoProgress.id = USERSCRIPT_ID

		videoOverlay.classList.add(VIDEO_OVERLAY)
		videoProgress.classList.add(VIDEO_PROGRESS)

		// document.insertAdjacentHTML('before', htmlVideoOverlay())

		// videoOverlay.setAttribute('style', CSS_VIDEO_OVERLAY)
		// videoProgress.setAttribute('style', CSS_VIDEO_PROGRESS)

		videoOverlay.append(videoProgress)

		const overlayReposition = () => {
			this.videoElement.after(videoOverlay)

			const temp1 = this.videoElement.getBoundingClientRect()
			if (parseFloat(videoOverlay.style.width)	!== Number(temp1.width.toFixed(3)) ||
				parseFloat(videoOverlay.style.height)	!== Number(temp1.height.toFixed(3)) ||
				parseFloat(videoOverlay.style.left)		!== Number(getOffset(this.videoElement, 'left').toFixed(3)) ||
				parseFloat(videoOverlay.style.top)		!== Number(getOffset(this.videoElement, 'top').toFixed(3))
			) {
				videoOverlay.style.display = 'none'
				setTimeout(() => {
					this.videoElement.after(videoOverlay)

					videoOverlay.style.removeProperty('display')

					const temp2 = this.videoElement.getBoundingClientRect()
					videoOverlay.style.width = temp2.width + 'px'
					videoOverlay.style.height = temp2.height + 'px'
					videoOverlay.style.left = getOffset(this.videoElement, 'left') + 'px'
					videoOverlay.style.top = getOffset(this.videoElement, 'top') + 'px'
				}, 1000)
			}
		}

		videoOverlay.addEventListener('click', (event) => {
			// console.log(event)
			event.preventDefault()

			overlayReposition()

			// this.videoElement.focus({ focusVisible: true })
		})
		// videoOverlay.addEventListener('mousedown', (event) => {
		// 	event.preventDefault()
		// })
		// videoOverlay.addEventListener('mouseup', (event) => {
		// 	event.preventDefault()
		// })

		if (this.videoElement.duration) {
			videoProgress.max = this.videoElement.duration
			overlayReposition()
		} else {
			this.videoElement.addEventListener('durationchange', (event) => {
				// console.log(event)
				videoProgress.max = this.videoElement.duration
				overlayReposition()
			})
		}
		this.videoElement.addEventListener('timeupdate', (event) => {
			// console.log(event)
			videoProgress.value = this.videoElement.currentTime
		})
	}
}


// main {

// addHotkey()
for (const videoElement of document.querySelectorAll('video')) {
	addVideoObj(videoElement)
}
// document.addEventListener('click', event => {
// 	console.log(event)
// })
document.addEventListener('mousedown', event => {
	// console.log(event)
	if (event.target.tagName === 'VIDEO') {
		addVideoObj(event.target)
	}
})
// document.addEventListener('mouseup', event => {
// 	console.log(event)
// })

// CSS
document.head.appendChild(document.createElement('style')).innerHTML = (`
#${USERSCRIPT_ID}.${VIDEO_OVERLAY} {
	all: revert;
	position: absolute;
	z-index: 2147483647;
	pointer-events: none;
}
#${USERSCRIPT_ID}.${VIDEO_OVERLAY}:active {
	background-color: #ff03;
}
#${USERSCRIPT_ID}.${VIDEO_OVERLAY} * {
	all: revert;
	pointer-events: initial;
}
#${USERSCRIPT_ID}.${VIDEO_PROGRESS} {
	width: calc(100% - 8px);
	height: 2px;
	padding: 1px;
	border: none;
	margin: 3px;
	bottom: 0px;
	position: absolute;
	display: block;
	background-color: #fffb;
}
#${USERSCRIPT_ID}.${VIDEO_PROGRESS}::-moz-progress-bar {
	background-color: #0007;
}
`
)

// } main


// 글로벌 핫키
// function addHotkey () {
// 	console.log('video control hotkey: [alt + a]')

// 	document.body.addEventListener('keydown', event => {
// 		// console.log(event)

// 		if (!event.shiftKey && !event.ctrlKey && !event.repeat) {
// 			if (event.altKey && event.code === 'KeyA') {
// 				addVideoControl()
// 			}
// 		}
// 	})
// }


// 비디오 요소 제어
function addVideoObj (videoElement) {
	// console.log(addVideoObj.name)

	if (videoElement.userscriptVideoObj) {
		// if (videoElement.userscriptVideoObj.videoElement === videoElement) {
		// 	videoElement.userscriptVideoObj.videoElement = videoElement
		// }
	} else {
		videoElement.userscriptVideoObj = new VideoObj(videoElement)
		videoElement.userscriptVideoObj.addVideoControl()
		videoElement.userscriptVideoObj.addVideoOverlay()
	}
}


// function htmlVideoControls () {
// 	return `
// <div id="temp-id" class="video-container">
// 	<style>

// 	</style>

// 	<div id="video-controls" class="controls" data-state="hidden">
// 		<button id="playpause" type="button" data-state="play">Play/Pause</button>
// 		<button id="stop" type="button" data-state="stop">Stop</button>
// 		<div class="progress">
// 			<progress id="progress" value="0" min="0">
// 				<span id="progress-bar"></span>
// 			</progress>
// 		</div>
// 		<button id="mute" type="button" data-state="mute">Mute/Unmute</button>
// 		<button id="volinc" type="button" data-state="volup">Vol+</button>
// 		<button id="voldec" type="button" data-state="voldown">Vol-</button>
// 		<button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
// 	</div>
// </div>
// `
// }
