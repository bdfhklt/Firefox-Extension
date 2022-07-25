// ==UserScript==
// @name         GUI overlay
// @version      1.0.2.20220621.0
// @downloadURL  http://localhost:5000/user-script?file-name=GUI-overlay
// @include      *
// @grant        none
// @noframes
// ==/UserScript==

const messageTimeoutMilliseconds = 2000
const messageOpacity = 0.75

const name1 = 'userscript-gui-overlay'

// GUI 오버레이
class GuiOverlay {
	constructor () {
		document.body.insertAdjacentHTML('beforeend', this.htmlGuiOverlay())
		this.element = document.body.querySelector(`#${name1}`)
		// this.element.guiOverlay = this
		this.message = new GuiMessage(this.element)

		window.addEventListener('message', (event) => {
			// console.log(event)

			// 사용법
			// top.postMessage({ id: 'gui-overlay-message', message: 'test message' }, '*')

			if (event.data.id === 'gui-overlay-message') {
				this.message.show(event.data.message)
			}
		})
	}

	htmlGuiOverlay () {
		return `
<div id="${name1}" style="all:initial; display: block; ">
	<style>
		#${name1} * {all:revert; }
		#${name1} span {word-break: keep-all; overflow-wrap: break-word; }
	</style>
</div>
`
	}
}

class GuiMessage {
	constructor (parentElement) {
		// this.guiBase = parentElement
		parentElement.insertAdjacentHTML('beforeend', this.htmlMessage())
		this.element = parentElement.querySelector(`#${name1}-message`)
		this.textElement = parentElement.querySelector(`#${name1}-message-text`)
		this.timeout = null
	}

	show (text = 'message') {
		this.textElement.textContent = text

		if (this.element.style.display === 'none') {
			this.element.style.display = 'block'
		} else {
			clearTimeout(this.timeout)
		}
		this.timeout = setTimeout(() => {
			this.element.style.display = 'none'
		}, messageTimeoutMilliseconds)
	}

	htmlMessage () {
		return `
<div id="${name1}-message" style="display: none; position: fixed; left: 40px; bottom: 40px; z-index: 2147483647; opacity: ${messageOpacity}; background-color: #000; padding: 10px 20px; border: medium double #777">
	<span id="${name1}-message-text" style="font-family: 맑은 고딕, 돋움체 !important; color: #fff; ">message</span>
</div>
`
	}
}


// main
let guiOverlay = null
if (window === top) {
	// eslint-disable-next-line no-unused-vars
	guiOverlay = new GuiOverlay()
}
