// ==UserScript==
// @name         public / video control
// @version      1.1.15.20240420.27
// @downloadURL  http://localhost:5000/user-script?file-name=video-control
// @include      *
// @grant        none
// ==/UserScript==

const CONSTROL_DELAY = 50 // 웹사이트의 비디오 플레이어 제어 충돌 방지

// element id, class name
const USERSCRIPT_ID = 'userscript-video-control'
const VIDEO_OVERLAY = 'video-overlay'
const VIDEO_PROGRESS = 'video-progress'


// v20240403
// element.offsetXXXX --> 정수로 반올림된 값
// 보다 정밀한 값을 return
function getOffset (element, propertyName) {
	let result

	if (element.offsetParent === null) return null
	switch (propertyName) {
	case 'left':
	case 'right':
	case 'top':
	case 'bottom':
		break
	default:
		return null
	}

	result =
		element.getBoundingClientRect()[propertyName] -
		element.offsetParent.getBoundingClientRect()[propertyName]

	if (element.offsetParent === document.body) {
		result += parseFloat(getComputedStyle(element.offsetParent)[`margin-${propertyName}`])
	}

	return result
}
// function getOffsetParent (element, propertyName) {
// 	if (element.offsetParent === null) return null
// 	switch (propertyName) {
// 	case 'left':
// 	case 'right':
// 	case 'top':
// 	case 'bottom':
// 		break
// 	default:
// 		return null
// 	}

// 	return element.getBoundingClientRect()[propertyName] - element.offsetParent.getBoundingClientRect()[propertyName]
// }
// function getOffsetDocumentBody (element, propertyName) {
// 	if (element.offsetParent === null) return null
// 	switch (propertyName) {
// 	case 'left':
// 	case 'right':
// 	case 'top':
// 	case 'bottom':
// 		break
// 	default:
// 		return null
// 	}

// 	return element.getBoundingClientRect()[propertyName] - document.documentElement.getBoundingClientRect()[propertyName]
// }


class VideoObj {
	constructor (videoElement) {
		this.videoElement = videoElement
		this.videoOverlay = null

		this.addVideoControl()
		this.addVideoOverlay()
	}

	// 핫키, 제어
	// keyboard shortcuts: https://support.mozilla.org/en-US/kb/html5-audio-and-video-firefox
	handleKeyAndMouseEvent (event) {
		console.log(event)
		const videoElement = this.videoElement

		let handledEvent = true
		let messageText = null
		const state = {
			paused: videoElement.paused,
			currentTime: videoElement.currentTime,
			volume: videoElement.volume
		}

		let isDelayed = false
		let work = null

		function videoPlayPauseToggle () {
			if (state.paused) {
				if (videoElement.currentTime === videoElement.duration) {
					videoElement.currentTime = 0
				}
				videoElement.play()
				messageText = '▶'
			} else {
				videoElement.pause()
				messageText = '⏸'
			}
		}

		function videoSeek (time) {
			videoElement.currentTime = time
		}

		function videoPauseSeek (time) {
			if (videoElement.paused) {
				videoSeek(time)
			} else {
				videoElement.pause()
			}
		}

		switch (event.type) {
		case 'keydown':
			switch (event.code) {
			// 재생, 정지
			case 'Space':
				isDelayed = true
				work = () => videoPlayPauseToggle()
				break

			// 탐색
			case 'ArrowLeft':
				isDelayed = true
				if (event.shiftKey) {
					work = () => videoSeek(state.currentTime - 20)
				} else if (event.ctrlKey) {
					work = () => videoSeek(state.currentTime - 5)
				} else {
					work = () => videoSeek(state.currentTime - 1)
				}
				break
			case 'ArrowRight':
				isDelayed = true
				if (event.shiftKey) {
					work = () => videoSeek(state.currentTime + 20)
				} else if (event.ctrlKey) {
					work = () => videoSeek(state.currentTime + 5)
				} else {
					work = () => videoSeek(state.currentTime + 1)
				}
				break

			// 정밀 탐색, 60fps
			case 'Comma':
				work = () => videoPauseSeek(state.currentTime - (1 / 60))
				break
			case 'Period':
				work = () => videoPauseSeek(state.currentTime + (1 / 60))
				break

			// 특정 지점 탐색
			case 'Home':
				work = () => {
					videoElement.currentTime = 0
					messageText = '⏮'
				}
				break
			case 'End':
				work = () => {
					if (!videoElement.paused) videoElement.pause()
					videoElement.currentTime = videoElement.duration
					messageText = '⏭'
				}
				break

			// 볼륨
			case 'ArrowUp':
				isDelayed = true
				work = () => {
					if (state.volume < 1.0) {
						videoElement.volume = Math.round((state.volume + 0.1) * 10) / 10
					}
					messageText = `${videoElement.volume * 100}%`
					// console.log(videoElement.volume)
				}
				break
			case 'ArrowDown':
				isDelayed = true
				work = () => {
					if (state.volume > 0) {
						videoElement.volume = Math.round((state.volume - 0.1) * 10) / 10
					}
					messageText = `${videoElement.volume * 100}%`
					// console.log(videoElement.volume)
				}
				break

			// 음소거
			case 'KeyM':
				work = () => {
					videoElement.muted = !videoElement.muted
					if (videoElement.muted) {
						messageText = '🔇'
					} else {
						messageText = `${videoElement.volume * 100}%`
					}
				}
				break

			// 재생 속도
			case 'NumpadAdd':
				work = () => {
					if (videoElement.playbackRate < 4) { // 4.0 초과: 소리가 안남
						const playbackRate = videoElement.playbackRate === 0.25 ? 0.3 : videoElement.playbackRate + 0.1
						videoElement.playbackRate = (Math.round(playbackRate * 100) / 100)
					}
					// console.log(videoElement.playbackRate)
					messageText = `x${videoElement.playbackRate.toFixed(2)}`
				}
				break
			case 'NumpadSubtract':
				work = () => {
					if (videoElement.playbackRate > 0.25) { // 0.25 미만: 소리가 안남
						const playbackRate = videoElement.playbackRate === 0.3 ? 0.25 : videoElement.playbackRate - 0.1
						videoElement.playbackRate = (Math.round(playbackRate * 100) / 100)
					}
					// console.log(videoElement.playbackRate)
					messageText = `x${videoElement.playbackRate.toFixed(2)}`
				}
				break
			case 'NumpadMultiply':
				work = () => {
					videoElement.playbackRate = videoElement.defaultPlaybackRate
					// console.log(videoElement.playbackRate)
					messageText = `x${videoElement.playbackRate.toFixed(2)}`
				}
				break

			// 컨트롤
			case 'KeyC':
				work = () => { videoElement.controls = !videoElement.controls }
				break

			// 반복
			case 'KeyL':
				work = () => { videoElement.loop = !videoElement.loop }
				break
			}
			break

		case 'click':
			// 재생, 정지
			if (this.videoOverlay.contains(event.target) && event.target === this.videoOverlay) {
				isDelayed = true
				work = () => videoPlayPauseToggle()
			}
			break

		default:
			handledEvent = false
			break
		}

		if (handledEvent) {
			// console.log('keydown')
			event.preventDefault()
			event.stopImmediatePropagation()
		}
		const postMessage = () => { if (messageText) top.postMessage({ id: 'gui-overlay-message', message: messageText }, '*') }
		if (isDelayed) {
			setTimeout(() => {
				work()
				postMessage()
			}, CONSTROL_DELAY)
		} else {
			work()
			postMessage()
		}
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
		// videoElement.controls = true

		// 커스텀 컨트롤
		// videoElement.insertAdjacentHTML('afterend', htmlVideoControls())
		// const videoContainer = videoElement.parentElement.querySelector('#temp-id')
		// videoContainer.removeAttribute('id')
		// videoContainer.prepend(videoElement)
		// videoContainer.style.position = getComputedStyle(videoElement).position

		// 테스트, [click, mousedown, mouseup]: firefox의 비디오 컨트롤에서 이벤트 감지 불가
		// videoElement.addEventListener('click', event => {
		// 	event.preventDefault()
		// 	console.log(videoElement, event)
		// 	// const temp1 = document.querySelector('#temp1')
		// 	// temp1.focus()
		// })
		// videoElement.addEventListener('mousedown', event => {
		// 	console.log(event)
		// })
		// videoElement.addEventListener('mouseup', event => {
		// 	console.log(event)
		// })

		videoElement.muted = false

		// 핫키, 제어
		// videoElement.addEventListener('keydown', this.videoControl)
	}

	addVideoOverlay () {
		const domParser = new DOMParser()

		const videoElement = this.videoElement
		// const videoOverlay = (this.videoOverlay = document.createElement(`${USERSCRIPT_ID}--div`))
		// const videoProgressContainer = document.createElement('div')
		// const videoProgress = document.createElement('progress')
		// const videoProgressBuffering = document.createElement('canvas')
		const tempElement = (domParser.parseFromString(htmlVideoOverlay(), 'text/html')).documentElement
		const videoOverlay = (this.videoOverlay = tempElement.querySelector(`#${USERSCRIPT_ID}.${VIDEO_OVERLAY}`))
		tempElement.remove()

		const videoProgressContainer = videoOverlay.querySelector(`.${VIDEO_PROGRESS}-container`)
		const videoProgress = videoOverlay.querySelector(`.${VIDEO_PROGRESS}`)
		const videoProgressBuffering = videoOverlay.querySelector(`.${VIDEO_PROGRESS}-buffering`)
		// const videoProgressTime = videoOverlay.querySelector(`.${VIDEO_PROGRESS}-time`)

		// for (const element of [
		// 	videoOverlay,
		// 	videoProgressContainer,
		// 	videoProgress,
		// 	videoProgressBuffering
		// ]) {
		// 	element.id = USERSCRIPT_ID
		// }

		// videoOverlay.classList.add(VIDEO_OVERLAY)
		// videoProgressContainer.classList.add(`${VIDEO_PROGRESS}-container`)
		// videoProgress.classList.add(VIDEO_PROGRESS)
		// videoProgressBuffering.classList.add(`${VIDEO_PROGRESS}-buffering`)

		// videoOverlay.append(videoProgressContainer)
		// videoProgressContainer.append(videoProgress)
		// videoProgressContainer.append(videoProgressBuffering)


		// 핫키, 제어
		videoOverlay.tabIndex = -1
		videoOverlay.addEventListener('keydown', event => this.handleKeyAndMouseEvent(event))
		videoOverlay.addEventListener('click', event => this.handleKeyAndMouseEvent(event))

		// 클릭시 비디오 포커스
		// videoProgressContainer.addEventListener('click', () => {
		// 	videoOverlay.focus()
		// })


		// 오버레이 재배치
		videoOverlay.overlayReposition = () => {
			if (videoElement.nextElementSibling !== videoOverlay) videoElement.after(videoOverlay)
			// const getOffset = videoOverlay.offsetParent === videoElement.offsetParent ? getOffsetParent : getOffsetDocumentBody
			if (videoElement.offsetParent === null) return

			const temp1 = videoElement.getBoundingClientRect()
			// const temp2 = getComputedStyle(videoElement.offsetParent)
			if (videoOverlay.style.width !== Number(temp1.width.toPrecision(6)) + 'px' ||
				videoOverlay.style.height !== Number(temp1.height.toPrecision(6)) + 'px' ||
				// videoOverlay.style.left		!== Number(
				// 	(getOffset(videoElement, 'left') + parseFloat(temp2['margin-left'])).toPrecision(6)
				// ) + 'px' ||
				// videoOverlay.style.top		!== Number(
				// 	(getOffset(videoElement, 'top') + parseFloat(temp2['margin-top'])).toPrecision(6)
				// ) + 'px'
				videoOverlay.style.left !== Number(getOffset(videoElement, 'left').toPrecision(6)) + 'px' ||
				videoOverlay.style.top !== Number(getOffset(videoElement, 'top').toPrecision(6)) + 'px'
			) {
				overlayRepositionProcess()
			}
		}
		const intervalId = setInterval(() => {
			if (videoElement.offsetParent !== null) videoOverlay.overlayReposition()
			else clearInterval(intervalId)
		}, 5000)

		const overlayRepositionProcess = () => {
			videoOverlay.style.display = 'none'

			if (videoOverlay.timeoutId) clearTimeout(videoOverlay.timeoutId)
			videoOverlay.timeoutId = setTimeout(() => {
				videoOverlay.style.removeProperty('display')

				if (videoElement.nextElementSibling !== videoOverlay) videoElement.after(videoOverlay)
				// const getOffset = videoOverlay.offsetParent === videoElement.offsetParent ? getOffsetParent : getOffsetDocumentBody
				if (videoElement.offsetParent === null) return

				const temp1 = videoElement.getBoundingClientRect()
				// const temp2 = getComputedStyle(videoElement.offsetParent)
				videoOverlay.style.width = temp1.width.toPrecision(6) + 'px'
				videoOverlay.style.height = temp1.height.toPrecision(6) + 'px'
				// videoOverlay.style.left =
				// 	(getOffset(videoElement, 'left') + parseFloat(temp2['margin-left'])).toPrecision(6) + 'px'
				// videoOverlay.style.top =
				// 	(getOffset(videoElement, 'top') + parseFloat(temp2['margin-top'])).toPrecision(6) + 'px'
				videoOverlay.style.left = getOffset(videoElement, 'left').toPrecision(6) + 'px'
				videoOverlay.style.top = getOffset(videoElement, 'top').toPrecision(6) + 'px'
			}, 600)
		}

		// resize 관찰
		videoOverlay.resizeObserver = new ResizeObserver(overlayRepositionProcess)
		videoOverlay.resizeObserver.observe(videoElement)

		videoOverlay.addEventListener('click', (event) => {
			// console.log(event)
			event.preventDefault()

			videoOverlay.overlayReposition()

			// videoElement.focus({ focusVisible: true })
		})
		// videoOverlay.addEventListener('mousedown', (event) => {
		// 	event.preventDefault()
		// })
		// videoOverlay.addEventListener('mouseup', (event) => {
		// 	event.preventDefault()
		// })


		// progress
		videoProgress.addEventListener('click', (event) => {
			// console.log(event)

			// video 탐색 이동
			const temp1 = videoProgress.getBoundingClientRect()
			const temp2 = getComputedStyle(videoProgress)
			// 좌표: 0 ~ (width - 1)
			const temp3 = (event.clientX - (temp1.x + parseFloat(temp2.paddingLeft))) / ((temp1.width - 1) - (parseFloat(temp2.paddingLeft) + parseFloat(temp2.paddingRight)))
			const temp4 = (temp3 >= 0 && temp3 <= 1) ? temp3 : Math.abs(parseInt(temp3))
			videoElement.currentTime = videoElement.duration * temp4
		})


		// 비디오 재생시간
		// function videoTimeUpdate () {

		// }

		// 비디오 길이
		if (videoElement.duration) {
			videoProgress.max = videoElement.duration
			videoOverlay.overlayReposition()
		}
		videoElement.addEventListener('durationchange', (event) => {
			// console.log(event)
			videoProgress.max = videoElement.duration
			videoOverlay.overlayReposition()
		})

		// let timeoutSwitch1 = false
		videoElement.addEventListener('timeupdate', (event) => {
			// console.log(event)
			videoProgress.value = videoElement.currentTime

			// 비디오 길이 확인
			// if (timeoutSwitch1 === false) {
			// 	// console.log('timeout process in timeupdate event')
			// 	timeoutSwitch1 = true
			// 	setTimeout(() => {
			// 		timeoutSwitch1 = false
			// 		if (videoProgress.max !== videoElement.duration) {
			// 			videoProgress.max = videoElement.duration
			// 		}
			// 	}, 5000)
			// }
		})


		// 비디오 버퍼링
		videoProgressBuffering.width = parseInt(getComputedStyle(videoProgressBuffering).width)
		videoProgressBuffering.height = 1

		let timeoutSwitch2 = false
		videoProgressBuffering.reflashBuffering = () => {
			const canvas = videoProgressBuffering
			const canvasContext = canvas.getContext('2d')

			if (timeoutSwitch2 === false) {
				timeoutSwitch2 = true
				setTimeout(() => {
					// console.log('timeout process in progress event')
					timeoutSwitch2 = false
					const canvasWidth = parseInt(getComputedStyle(canvas).width)
					if (canvas.width !== canvasWidth) canvas.width = canvasWidth
				}, 5000)
			}

			canvasContext.clearRect(0, 0, canvas.width, canvas.height)
			canvasContext.fillStyle = '#0002'

			const inc = canvas.width / videoElement.duration
			for (let i = 0; i < videoElement.buffered.length; i++) {
				const startX = videoElement.buffered.start(i) * inc
				const endX = videoElement.buffered.end(i) * inc
				const fillWidth = endX - startX

				canvasContext.fillRect(startX, 0, fillWidth, canvas.height)
			}
		}
		let timeout1 = null
		videoElement.addEventListener('progress', (event) => {
			// console.log(event)
			videoProgressBuffering.reflashBuffering()

			if (timeout1) clearTimeout(timeout1)
			timeout1 = setTimeout(() => {
				videoProgressBuffering.reflashBuffering()
			}, 2000)
		})
	}
}


// main {

// CSS
document.head.appendChild(document.createElement('style')).innerHTML = (`
#${USERSCRIPT_ID}.${VIDEO_OVERLAY} {
	all: initial;
	display: block;

	position: absolute;
	z-index: 2147483647;
	/* pointer-events: none; */
}
#${USERSCRIPT_ID}.${VIDEO_OVERLAY}:active {
	background-color: #ff01;
}
#${USERSCRIPT_ID}.${VIDEO_OVERLAY} * {
	all: revert;
	pointer-events: initial;
}
#${USERSCRIPT_ID} .${VIDEO_PROGRESS}-container {
	width: 100%;
	height: 26px;
	bottom: 0px;
	position: absolute;
	display: block;
}
#${USERSCRIPT_ID} .${VIDEO_PROGRESS}-container:hover > .${VIDEO_PROGRESS},
#${USERSCRIPT_ID} .${VIDEO_PROGRESS}-container:hover > .${VIDEO_PROGRESS}-buffering {
	height: 15px;
}
#${USERSCRIPT_ID} .${VIDEO_PROGRESS} {
	width: calc(100% - 8px);
	height: 2px;
	padding: 1px;
	border: none;
	margin: 3px;
	bottom: 0px;
	position: absolute;
	display: block;
	background-color: #fffb;
	transition-property: height;
	transition-duration: 0.4s;

	-webkit-box-sizing: content-box;
}
#${USERSCRIPT_ID} .${VIDEO_PROGRESS}::-moz-progress-bar {
	background-color: #0007;
}
#${USERSCRIPT_ID} .${VIDEO_PROGRESS}::-webkit-progress-bar {
	background-color: transparent;
}
#${USERSCRIPT_ID} .${VIDEO_PROGRESS}::-webkit-progress-value {
	background-color: #0007;
}
#${USERSCRIPT_ID} .${VIDEO_PROGRESS}-buffering {
	width: calc(100% - 8px);
	height: 2px;
	padding: 1px;
	border: none;
	margin: 3px;
	bottom: 0px;
	position: absolute;
	display: block;
	transition-property: height;
	transition-duration: 0.4s;
	pointer-events: none;
}
`
)

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

// const temp1 = document.createElement('div')
// temp1.id = 'temp1'
// temp1.style.display = 'none'
// temp1.tabIndex = 0
// document.body.append(temp1)

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


function htmlVideoOverlay () {
	return `
<${USERSCRIPT_ID}--div id="${USERSCRIPT_ID}" class="${VIDEO_OVERLAY}" tabindex="-1">
	<div class="${VIDEO_PROGRESS}-container">
		<!-- <div class="${VIDEO_PROGRESS}-time">00:00:00</div> -->
		<progress class="${VIDEO_PROGRESS}"></progress>
		<canvas class="${VIDEO_PROGRESS}-buffering"></canvas>
	</div>
</${USERSCRIPT_ID}--div>
`
}
