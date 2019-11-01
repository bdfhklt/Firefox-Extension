var tmp1 = 0

$(() => { // 자동시작
	// alert('test')
})

browser.runtime.onMessage.addListener((message) => {
	if (message[0] === 'get selection') {
		tmp1 = window.getSelection().toString()
		if (tmp1.length) {
			browser.runtime.sendMessage(['selection string', tmp1])
		} else {
			browser.runtime.sendMessage(['selection string', false])
		}
	} else if (message[0] === 'find') {
		do {
			var tmp2 = document.getElementsByClassName('tmpClass1')
			for (var tmp3 of tmp2) {
				document.body.removeChild(tmp3)
			}
		} while (tmp2.length)
		if (message[1]) {
			if (message[1].rects.length <= 1000) {
				redactAll(message[1].rects)
			} else if (message[1].rects.length > 1000) {
				alert(message[1].rects.length)
			}
		}
	}
})

function redactRect (rect) {
	var redaction = document.createElement('div')

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
	tmp1 = [document.documentElement.scrollHeight / 100, (document.documentElement.clientHeight - 34) / document.documentElement.clientHeight]
	for (match of rectData) {
		for (rect of match.rectsAndTexts.rectList) {
			redactRect(rect)
		}
	}
}
