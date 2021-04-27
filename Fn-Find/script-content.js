;(() => { // 자동시작
	// alert('test')
})()

browser.runtime.onMessage.addListener((message) => {
	if (message[0] === 'get selection') {
		let tmp1 = selectionStringGet()
		if (tmp1) {
			browser.runtime.sendMessage(['selection string', tmp1])
		} else {
			browser.runtime.sendMessage(['selection string', false])
		}
	} else if (message[0] === 'find') {
		let tmp1 = document.querySelectorAll('.tmpClass1')
		if (tmp1) {
			for (const element of tmp1) {
				element.remove()
			}
		}
		if (message[1]) {
			if (message[1].rects.length <= 1000) {
				redactAll(message[1].rects)
			} else if (message[1].rects.length > 1000) {
				alert(message[1].rects.length)
			}
		}
	}
})

function redactRect (rect, tmp1) {
	let redaction = document.createElement('div')

	redaction.className = 'tmpClass1'

	// redaction.style.backgroundColor = 'black'
	// redaction.style.position = 'fixed'

	// redaction.style.top = `${rect.top / tmp1}%`
	redaction.style.top = `calc(${rect.top / tmp1[0] * tmp1[1]}% + 14px)`

	// redaction.style.top = `${rect.top}px`
	// redaction.style.left = `${rect.left}px`
	// redaction.style.width = `${rect.right-rect.left}px`
	// redaction.style.height = `${rect.bottom-rect.top}px`
	document.body.appendChild(redaction)
}

function redactAll (rectData) {
	let scrollbar = [
		document.documentElement.scrollHeight / 100,
		(document.documentElement.clientHeight - 34) / document.documentElement.clientHeight
	]
	for (const match of rectData) {
		for (const rect of match.rectsAndTexts.rectList) {
			redactRect(rect, scrollbar)
		}
	}
}

function selectionStringGet () {
	let selectString = document.getSelection().toString() // 선택된 텍스트 추출
	if (selectString) {
		// console.log(selectString)
		return selectString
	} else {
		let selectionElement = document.activeElement // input 등 입력창에서 추출
		if (selectionElement.value) {
			selectString = selectionElement.value.substring(selectionElement.selectionStart, selectionElement.selectionEnd)
			// console.log(selectString)
			return selectString
		}
	}
}
