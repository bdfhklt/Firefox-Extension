const name1 = 'fn-translate'
let xValue = 0
let yValue = 0;

(() => {
	// alert('test')
	document.addEventListener('mouseup', (event) => { // 마우스업 이벤트 추가
		// console.log(event)
		if (event.button === 0) { // 0: 마우스 왼쪽 버튼
			setTimeout(() => { // setTimeout: 선택된 택스트 클릭하면 선택이 풀려도 버튼 재생성 방지
				let target = event.target
				while (target) { // 상위엘리먼트 탐색
					// console.log(target)
					if (target.classList.contains(name1)) { // 클래스 포함 여부
						break
					} else {
						target = target.parentElement
					}
				}
				if (!target) {
					translateButton(event)
				}
			}, 0)
			// console.log('mouseup')
		}
	})
})()

browser.runtime.onMessage.addListener((message) => { // 메시지 리스너
	if (message.id === 'translate') {
		translate(getSelectionText())
	}
})

function getSelectionText () {
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

function translateButton (event) {
	let element = document.getElementsByClassName(name1)[0]
	if (element) element.remove() // 버튼 or 창 제거
	let selectionText = getSelectionText()
	if (selectionText) {
		document.body.insertAdjacentHTML('beforeend', htmlBase())
		document.getElementsByClassName(name1)[0].insertAdjacentHTML('beforeend', htmlButton()) // 버튼 추가
		xValue = event.clientX
		yValue = event.clientY
		element = document.getElementById(`${name1}-button`)
		moveElement(element)
		element.addEventListener('click', (event) => { // 버튼 클릭 이벤트 추가
			event.preventDefault()
			// translate(selectionText)
			browser.runtime.sendMessage({
				id: 'translate',
				selectionText: selectionText
			}).then((response) => {
				console.log(response)
			})
			// console.log('button click')
		})
	}
}

function translate (selectionText) {
	if (!selectionText) return
	let resultData = ''
	let button = document.getElementById(`${name1}-button`)
	if (button) button.remove() // 버튼 제거
	document.getElementsByClassName(name1)[0].insertAdjacentHTML('beforeend', htmlPopup()) // 팝업 레이어 추가
	let page = document.getElementById(`${name1}-page`)
	document.getElementById(`${name1}-data`).textContent = selectionText
	moveElement(page)
	let xhr = new XMLHttpRequest()
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// console.log(xhr.responseText)
			// console.log(JSON.parse(xhr.responseText))
			resultData = JSON.parse(xhr.responseText)
		}
	}
	xhr.open('POST', 'http://192.168.99.100:5000/googletranslate', false) // false: 동기
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
	xhr.send(`data=${encodeURIComponent(selectionText)}`)
	// console.log(resultData)
	// console.log(resultData.data1)
	let data = document.getElementById(`${name1}-data`)
	if (resultData.data2) { // 팝업 데이터 갱신
		// console.log(resultData.data2)
		data.textContent = `${resultData.data1}\n\n${resultData.data2}`
	} else {
		data.textContent = resultData.data1
	}
	moveElement(page)
	dragMoveElement(page, null, document.getElementById(`${name1}-data`)) // 드래그 기능 추가
	// console.log('popup')
}

function moveElement (element) { // 위치 조정
	element.style.left = '0px'
	element.style.top = '0px'
	let xMove = xValue
	let yMove = yValue
	let wiwidth = window.innerWidth - (element.offsetWidth + 36) // +16 스크롤바 폭
	let wiheight = window.innerHeight - (element.offsetHeight + 20)
	if (xMove > wiwidth) xMove = wiwidth // 화면 이탈 방지
	if (yMove > wiheight) yMove = wiheight
	if (xMove < 0) xMove = 0
	if (yMove < 0) yMove = 0
	element.style.left = `${xMove + 10}px` // 마우스 좌표로 이동
	element.style.top = `${yMove + 10}px`
}

function dragMoveElement (movingElement, targetElement, stopElement) { // 드래그 이동
	let x1 = 0
	let y1 = 0
	if (targetElement) {
		targetElement.addEventListener('mousedown', dragMouseDown)
	} else {
		movingElement.addEventListener('mousedown', dragMouseDown)
	}
	if (stopElement) {
		stopElement.addEventListener('mousedown', (event) => {
			event.stopPropagation() // 이벤트 전파 차단
		})
	}

	function dragMouseDown (event) { // 드래그 시작
		// event = event || window.event
		event.preventDefault()
		x1 = event.clientX
		y1 = event.clientY
		document.addEventListener('mouseup', stopDrag)
		document.addEventListener('mousemove', elementDrag)
	}

	function stopDrag () { // 드래그 중지
		document.removeEventListener('mouseup', stopDrag)
		document.removeEventListener('mousemove', elementDrag)
	}

	function elementDrag (event) { // 드래그
		// event = event || window.event
		event.preventDefault()
		let x2 = x1 - event.clientX
		let y2 = y1 - event.clientY
		x1 = event.clientX
		y1 = event.clientY
		movingElement.style.top = `${movingElement.offsetTop - y2}px`
		movingElement.style.left = `${movingElement.offsetLeft - x2}px`
	}
}

function htmlBase (params) { // 팝업 기초
	return `
<div class="${name1}">
	<style>
		.${name1}, .${name1} * {all:initial; }
		.${name1} style {display: none; }
		.${name1} div {display: block; }
		.${name1} pre {display: block; font-family: monospace; white-space: pre; margin: 1em 0; }
	</style>
</div>
`
}

function htmlButton () { // 팝업 생성 버튼
	return `
<div id="${name1}-button" style="background-color:rgba(255,255,255,0.5); border: 1px solid; border-radius: 10px; padding: 10px; position: fixed; z-index: 2147483647; cursor: pointer; ">
</div>
`
}

function htmlPopup () { // 팝업 레이어
	return `
<div id="${name1}-page" style="background-color:rgba(255,255,255,0.9); border: 2px solid; border-radius: 10px; padding: 8px; position: fixed; z-index: 2147483646; cursor: move; ">
	<div style="max-width: 400px; max-height: 300px; overflow: auto; ">
		<pre id="${name1}-data" style="white-space: pre-wrap; margin: 0px; font-family: 돋움체 !important; "></pre>
	</div>
</div>
`
}
