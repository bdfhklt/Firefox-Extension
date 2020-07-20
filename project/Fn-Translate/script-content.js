const name1 = 'fn-translate'
let pointX = 0
let pointY = 0
let responseJSONArr = [];

(() => {
	// alert('test')
	document.addEventListener('mouseup', event => { // 마우스업 이벤트 추가
		// console.log(event)
		if (event.button === 0) { // 0: 마우스 좌측 버튼
			let target = event.target
			while (target) { // 상위엘리먼트 탐색
				// console.log(target)
				if (target.classList.contains(name1)) { // 클래스 포함 체크
					break
				} else {
					target = target.parentElement
				}
			}
			if (!target) {
				pointX = event.clientX
				pointY = event.clientY
				setTimeout(() => { // setTimeout: 선택된 택스트 클릭하면 선택이 풀려도 버튼 재생성 방지
					translateButton()
				}, 0)
			}
			// console.log('mouseup')
		} else if (event.button === 2) { // 2: 마우스 우측 버튼
			pointX = event.clientX
			pointY = event.clientY
		}
	})
})()

browser.runtime.onMessage.addListener((message, sender, sendResponse) => { // 메시지 리스너
	switch (message.id) {
	case 'translate':
		translate(message.selectionText)
		break
	case 'storage':
		// console.log(window.location)
		// console.log(window.parent.location)
		if (window.location === window.parent.location) { // iframe 아니면 true
			translate()
		}
		break
	}
})

function getSelectionText () {
	let selectString = document.getSelection().toString() // 선택된 텍스트 추출
	if (selectString) {
		// console.log(selectString)
		return selectString
	} else {
		const selectionElement = document.activeElement // input 등 입력창에서 추출
		if (selectionElement.value) {
			selectString = selectionElement.value.substring(selectionElement.selectionStart, selectionElement.selectionEnd)
			// console.log(selectString)
			return selectString
		}
	}
}

function translateButton () {
	removeElement(document.getElementsByClassName(name1)[0]) // 모든 팝업 제거
	const selectionText = getSelectionText()
	if (selectionText) {
		document.body.insertAdjacentHTML('beforeend', htmlBase())
		document.getElementsByClassName(name1)[0].insertAdjacentHTML('beforeend', htmlButton()) // 버튼 추가
		const button = document.getElementById(`${name1}-button`)
		moveToPoint(button)
		moveInsideScreen(button)
		button.addEventListener('click', event => { // 버튼 클릭 이벤트 추가
			// event.preventDefault()
			translate(selectionText)
			// console.log('button click')
		})
	}
}

async function translate (selectionText) {
	// removeElement(document.getElementById(`${name1}-button`)) // 버튼 제거
	removeElement(document.getElementsByClassName(name1)[0]) // 모든 팝업 제거
	document.body.insertAdjacentHTML('beforeend', htmlBase())
	let base = document.getElementsByClassName(name1)[0]
	base.insertAdjacentHTML('beforeend', htmlPopup1()) // 팝업 레이어 추가
	const data1 = document.getElementById(`${name1}-data1`)
	data1.insertAdjacentHTML('beforeend', htmlPopupData())
	const page1 = document.getElementById(`${name1}-page1`)
	page1.addEventListener('click', () => {
		removeElement(document.getElementById(`${name1}-page2`))
	})
	document.getElementById(`${name1}-temp`).textContent = selectionText
	moveToPoint(page1)
	moveInsideScreen(page1)
	// crawlerServer()
	await browser.runtime.sendMessage({ // 번역 요청
		id: 'translate',
		selectionText: selectionText
	}).then(response => {
		// console.log(response)
		responseJSONArr = response
	})
	data1.textContent = '' // 하위 엘리먼트 제거
	if (responseJSONArr[0][5]) { // 번역들, 줄바꿈
		let oneTimeFalse1 = false
		responseJSONArr[0][5].forEach(arrElement1 => {
			if (arrElement1[2]) {
				if (oneTimeFalse1) data1.appendChild(document.createTextNode(' '))
				else oneTimeFalse1 = true
				data1.insertAdjacentHTML('beforeend', htmlPopupData()) // 데이터 추가
				const temp1 = document.getElementById(`${name1}-temp`)
				temp1.removeAttribute('id')
				// console.log(arrElement[2][0][0])
				temp1.textContent = arrElement1[2][0][0]
				temp1.addEventListener('click', event => { // 보조 팝업
					event.stopPropagation()
					removeElement(document.getElementById(`${name1}-page2`))
					base.insertAdjacentHTML('beforeend', htmlPopup2()) // 보조 팝업 레이어 추가
					const data2 = document.getElementById(`${name1}-data2`)
					const tempArr1 = arrElement1[2].slice()
					tempArr1.unshift(arrElement1[0]) // 번역 원본
					let oneTimeFalse2 = false
					tempArr1.forEach(arrElement2 => { // 의미들
						let textContent1 = arrElement2[0]
						if (oneTimeFalse2) data2.appendChild(document.createTextNode('\n'))
						else {
							oneTimeFalse2 = true
							textContent1 = arrElement2
						}
						data2.insertAdjacentHTML('beforeend', htmlPopupData()) // 데이터 추가
						const temp2 = document.getElementById(`${name1}-temp`)
						temp2.removeAttribute('id')
						temp2.textContent = textContent1
						temp2.addEventListener('click', () => { // 선택 변경
							temp1.textContent = textContent1
							removeElement(document.getElementById(`${name1}-page2`))
						})
					})
					pointX = event.clientX
					pointY = event.clientY
					const page2 = document.getElementById(`${name1}-page2`)
					moveToPoint(page2)
					moveInsideScreen(page2)
				})
			} else {
				// console.log(arrElement[0])
				data1.appendChild(document.createTextNode(arrElement1[0]))
			}
		})
	} else if (responseJSONArr[0][0]) { // 긴 문장 번역
		let tempString = ''
		responseJSONArr[0][0].forEach(arrElement => {
			if (arrElement[0]) tempString += arrElement[0]
		})
		data1.insertAdjacentHTML('beforeend', htmlPopupData()) // 데이터 추가
		const temp1 = document.getElementById(`${name1}-temp`)
		temp1.removeAttribute('id')
		temp1.textContent = tempString
	}
	if (responseJSONArr[0][1]) { // 단어 번역, 품사
		responseJSONArr[0][1].forEach(arrElement1 => {
			data1.appendChild(document.createTextNode('\n\n'))
			let tempString = `${arrElement1[0]}\n`
			let oneTimeFalse = false
			arrElement1[1].forEach(arrElement2 => {
				if (oneTimeFalse) tempString += ', '
				else oneTimeFalse = true
				tempString += arrElement2
			})
			data1.insertAdjacentHTML('beforeend', htmlPopupData()) // 데이터 추가
			const temp1 = document.getElementById(`${name1}-temp`)
			temp1.removeAttribute('id')
			temp1.textContent = tempString
		})
	}
	moveInsideScreen(page1)
	dragMoveElement(page1, null, document.getElementById(`${name1}-data1`)) // 드래그 기능 추가
	// console.log('popup')

	// function crawlerServer () { // 크롤러 서버
	// 	let resultData = ''
	// 	const xhr = new XMLHttpRequest()
	// 	xhr.onreadystatechange = () => {
	// 		if (xhr.readyState === 4 && xhr.status === 200) {
	// 			// console.log(xhr.responseText)
	// 			// console.log(JSON.parse(xhr.responseText))
	// 			resultData = JSON.parse(xhr.responseText)
	// 		}
	// 	}
	// 	xhr.open('POST', 'http://192.168.99.100:5000/googletranslate', false) // false: 동기
	// 	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
	// 	xhr.send(`data=${encodeURIComponent(selectionText)}`)
	// 	// console.log(resultData)
	// 	// console.log(resultData.data1)
	// 	let data = document.getElementById(`${name1}-temp`)
	// 	if (resultData.data2) { // 팝업 데이터 갱신
	// 		// console.log(resultData.data2)
	// 		data.textContent = `${resultData.data1}\n\n${resultData.data2}`
	// 	} else {
	// 		data.textContent = resultData.data1
	// 	}
	// }
}

function removeElement (element) {
	if (element) element.remove()
}

function moveToPoint (element) { // 지정된 지점으로 이동
	element.style.left = `${pointX}px`
	element.style.top = `${pointY}px`
}

function moveInsideScreen (element) { // 화면 내부로 이동
	let elementLeft = parseInt(element.style.left)
	let elementTop = parseInt(element.style.top)
	element.style.left = '0px'
	element.style.top = '0px'
	const maxLeft = window.innerWidth - (element.offsetWidth + parseInt(element.style.marginLeft) + parseInt(element.style.marginRight))
	const maxTop = window.innerHeight - (element.offsetHeight + parseInt(element.style.marginTop) + parseInt(element.style.marginBottom))
	if (elementLeft > maxLeft) elementLeft = maxLeft
	if (elementTop > maxTop) elementTop = maxTop
	if (elementLeft < 0) elementLeft = 0
	if (elementTop < 0) elementTop = 0
	element.style.left = `${elementLeft}px` // 이동
	element.style.top = `${elementTop}px`
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
		stopElement.addEventListener('mousedown', event => {
			event.stopPropagation() // 이벤트 전파 차단
		})
	}

	function dragMouseDown (event) { // 드래그 시작
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
		event.preventDefault()
		const x2 = x1 - event.clientX
		const y2 = y1 - event.clientY
		x1 = event.clientX
		y1 = event.clientY
		movingElement.style.left = `${parseInt(movingElement.style.left) - x2}px`
		movingElement.style.top = `${parseInt(movingElement.style.top) - y2}px`
	}
}

function htmlBase () { // 팝업 기초(스타일 초기화)
	return `
<div class="${name1}">
	<style>
		.${name1}, .${name1} * {all:initial; }
		.${name1} style {display: none; }
		.${name1} div {display: block; }
		.${name1} span {}
	</style>
</div>
`
}

function htmlButton () { // 팝업 생성 버튼
	return `
<div id="${name1}-button" style="background-color:rgba(255,255,255,0.5); border: 1px solid; border-radius: 10px; padding: 9px; margin: 10px; position: fixed; z-index: 2147483647; cursor: pointer; ">
</div>
`
}

function htmlPopup1 () { // 팝업 레이어
	return `
<div id="${name1}-page1" style="background-color:rgba(255,255,255,0.9); border: 2px solid; border-radius: 10px; padding: 8px; margin: 10px; position: fixed; z-index: 2147483646; cursor: move; ">
	<style>
		.${name1}-text:hover {background-color: rgba(255,255,0,0.3); }
	</style>
	<div id="${name1}-data1" style="max-width: 400px; max-height: 300px; overflow: auto; white-space: pre-wrap; "></div>
</div>
`
}

function htmlPopupData () {
	return `<span id="${name1}-temp" class="${name1}-text" style="white-space: pre-wrap; font-family: 돋움체 !important; "></span>`
}

function htmlPopup2 () { // 보조 팝업 레이어
	return `
<div id="${name1}-page2" style="background-color:rgba(255,255,255,0.9); border: 2px solid; padding: 2px; margin: 10px; position: fixed; z-index: 2147483647; ">
	<div id="${name1}-data2" style="max-width: 400px; max-height: 300px; overflow: auto; white-space: pre-wrap; "></div>
</div>
`
}
