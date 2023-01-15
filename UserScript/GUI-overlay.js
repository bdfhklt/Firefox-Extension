// ==UserScript==
// @name         GUI overlay
// @version      1.0.4.20221202.6
// @downloadURL  http://localhost:5000/user-script?file-name=GUI-overlay
// @include      *
// @grant        none
// @noframes
// ==/UserScript==

// config
const messageTimeoutMilliseconds = 2000
const messageOpacity = 0.75

// element id, class name
const USERSCRIPT_ID = 'userscript-gui-overlay'
const OVERLAY_BASE = 'overlay-base'
const OVERLAY_MESSAGE = 'overlay-message'
const OVERLAY_MESSAGE_TEXT = 'overlay-message-text'


// GUI 오버레이
class GuiOverlay {
	constructor () {
		// document.body.insertAdjacentHTML('beforeend', this.htmlGuiOverlay())
		// this.element = document.body.querySelector(`#${USERSCRIPT_ID}`)
		// this.element.guiOverlay = this

		const guiOverlay = (this.element = document.createElement('div'))
		this.message = new GuiMessage(this.element)

		guiOverlay.id = USERSCRIPT_ID
		guiOverlay.classList.add(OVERLAY_BASE)
		document.body.append(guiOverlay)

		window.addEventListener('message', (event) => {
			// console.log(event)

			// 사용법
			// top.postMessage({ id: 'gui-overlay-message', message: 'test message' }, '*')

			if (event.data.id === 'gui-overlay-message') {
				this.message.show(event.data.message)
			}
		})
	}

// 	htmlGuiOverlay () {
// 		return `
// <div id="${USERSCRIPT_ID}" style="all:initial; display: block; ">
// 	<style>
// 		#${USERSCRIPT_ID} * {all:revert; }
// 		#${USERSCRIPT_ID} span {word-break: keep-all; overflow-wrap: break-word; }
// 	</style>
// </div>
// `
// 	}
}

class GuiMessage {
	constructor (parentElement) {
		// this.guiBase = parentElement
		// parentElement.insertAdjacentHTML('beforeend', this.htmlMessage())
		// this.element = parentElement.querySelector(`#${USERSCRIPT_ID}-message`)
		// this.textElement = parentElement.querySelector(`#${USERSCRIPT_ID}-message-text`)
		this.timeout = null

		const overlayMessage = (this.element = document.createElement('div'))
		const overlayMessageText = (this.textElement = document.createElement('span'))

		overlayMessage.id = USERSCRIPT_ID
		overlayMessageText.id = USERSCRIPT_ID

		overlayMessage.classList.add(OVERLAY_MESSAGE)
		overlayMessageText.classList.add(OVERLAY_MESSAGE_TEXT)

		overlayMessage.append(overlayMessageText)
		parentElement.append(overlayMessage)

		overlayMessage.style.display = 'none'
	}

	show (text = 'message') {
		this.textElement.textContent = text

		// if (this.element.style.display === 'none') {
		// 	this.element.style.display = 'block'
		if (this.element.style.display === 'none') {
			this.element.style.removeProperty('display')
		} else {
			clearTimeout(this.timeout)
		}
		this.timeout = setTimeout(() => {
			this.element.style.display = 'none'
		}, messageTimeoutMilliseconds)
	}

// 	htmlMessage () {
// 		return `
// <div id="${USERSCRIPT_ID}-message" style="display: none; position: fixed; left: 40px; bottom: 40px; z-index: 2147483647; opacity: ${messageOpacity}; background-color: #000; padding: 10px 20px; border: medium double #777">
// 	<span id="${USERSCRIPT_ID}-message-text" style="font-family: Segoe UI !important; color: #fff; ">message</span>
// </div>
// `
// 	}
}


// main
let guiOverlay = null
if (window === top) {
	// CSS
	document.head.appendChild(document.createElement('style')).innerHTML = (`
#${USERSCRIPT_ID}.${OVERLAY_BASE} {
	all: initial;
	display: block;
}
#${USERSCRIPT_ID}.${OVERLAY_BASE} * {
	all: revert;
}
#${USERSCRIPT_ID}.${OVERLAY_BASE} span {
	word-break: keep-all;
	overflow-wrap: break-word;
}
#${USERSCRIPT_ID}.${OVERLAY_MESSAGE} {
	position: fixed;
	left: 40px;
	bottom: 40px;
	z-index: 2147483647;
	opacity: ${messageOpacity};
	background-color: #000;
	padding: 10px 20px;
	border: medium double #777;
}
#${USERSCRIPT_ID}.${OVERLAY_MESSAGE_TEXT} {
	font-family: Segoe UI;
	font-size: medium;
	color: #fff;
}
`
	)
	// eslint-disable-next-line no-unused-vars
	guiOverlay = new GuiOverlay()
}
