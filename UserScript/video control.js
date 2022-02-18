// ==UserScript==
// @name         video control
// @version      1.0.48.20220215
// @include      *
// @grant        none
// ==/UserScript==


// main {

// addHotkey()
for (const videoElement of document.querySelectorAll('video:not([data-video-control])')) {
	addVideoControl(videoElement)
}
// document.addEventListener('click', event => {
// 	console.log(event)
// })
document.addEventListener('mousedown', event => {
	// console.log(event)
	if (event.target.tagName === 'VIDEO' && !event.target.dataset.videoControl) {
		addVideoControl(event.target)
	}
})
// document.addEventListener('mouseup', event => {
// 	console.log(event)
// })

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
function addVideoControl (videoElement) {
	console.log(addVideoControl.name)

	// 중복 방지, querySelector('video:not([data-video-control])')
	videoElement.dataset.videoControl = true

	// 커스텀 컨트롤
	// videoElement.insertAdjacentHTML('afterend', htmlVideoControls())
	// const videoContainer = videoElement.parentElement.querySelector('#temp-id')
	// videoContainer.removeAttribute('id')
	// videoContainer.prepend(videoElement)
	// videoContainer.style.position = getComputedStyle(videoElement).position

	// 테스트
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
		switch (event.code) {
		// 재생, 정지
		case 'Space':
			if (videoElement.paused) videoElement.play()
			else videoElement.pause()
			break

		// 탐색
		case 'ArrowLeft':
			if (event.shiftKey) {
				videoElement.currentTime -= 20
			} else if (event.ctrlKey) {
				videoElement.currentTime -= 5
			} else {
				videoElement.currentTime -= 1
			}
			break
		case 'ArrowRight':
			if (event.shiftKey) {
				videoElement.currentTime += 20
			} else if (event.ctrlKey) {
				videoElement.currentTime += 5
			} else {
				videoElement.currentTime += 1
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
			break
		case 'End':
			if (!videoElement.paused) videoElement.pause()
			videoElement.currentTime = videoElement.seekable.end(0)
			break

		// 볼륨
		case 'ArrowUp':
			if (videoElement.volume < 1.0) {
				videoElement.volume = Math.round((videoElement.volume + 0.1) * 10) / 10
			}
			console.log(videoElement.volume)
			break
		case 'ArrowDown':
			if (videoElement.volume > 0) {
				videoElement.volume = Math.round((videoElement.volume - 0.1) * 10) / 10
			}
			console.log(videoElement.volume)
			break

		// 음소거
		case 'KeyM':
			videoElement.muted = !videoElement.muted
			break

		// 재생 속도
		case 'NumpadAdd':
			if (videoElement.playbackRate < 4) { // 4.0 초과: 소리가 안남
				const playbackRate = videoElement.playbackRate === 0.25 ? 0.3 : videoElement.playbackRate + 0.1
				videoElement.playbackRate = (Math.round(playbackRate * 100) / 100)
			}
			console.log(videoElement.playbackRate)
			break
		case 'NumpadSubtract':
			if (videoElement.playbackRate > 0.25) { // 0.25 미만: 소리가 안남
				const playbackRate = videoElement.playbackRate === 0.3 ? 0.25 : videoElement.playbackRate - 0.1
				videoElement.playbackRate = (Math.round(playbackRate * 100) / 100)
			}
			console.log(videoElement.playbackRate)
			break
		case 'NumpadMultiply':
			videoElement.playbackRate = videoElement.defaultPlaybackRate
			console.log(videoElement.playbackRate)
			break

		default:
			keydown = false
			break
		}
		if (keydown) {
			// console.log('keydown')
			event.preventDefault()
		}
	})
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
