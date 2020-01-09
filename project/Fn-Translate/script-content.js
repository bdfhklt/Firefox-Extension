const name1 = 'fn-translate'
let x = 0
let y = 0

$(() => { // 자동시작
	// alert('test')
	$(document).on(`mouseup.${name1}-button`, (e) => { // 마우스업 이벤트 추가
		// console.log(e)
		setTimeout(() => { // (setTimeout) 선택된 택스트 클릭하면 선택이 풀려도 버튼 재생성 방지
			if (!$(e.target).parents(`.${name1}`).length) {
				$(`.${name1}`).remove() // 버튼 제거
				let selectionString = selectionStringGet()
				if (selectionString) {
					$('html body').append(htmlbutton()) // 버튼 추가
					x = e.clientX
					y = e.clientY
					let wiwidth = window.innerWidth - 40
					let wiheight = window.innerHeight - 40
					if (x > wiwidth) x = wiwidth
					if (y > wiheight) y = wiheight
					if (x < 0) x = 0
					if (y < 0) y = 0
					$(`#${name1}-button`).css('left', x + 10) // 마우스 좌표로 이동
					$(`#${name1}-button`).css('top', y + 10)
					$(`#${name1}-button`).click((e) => { // 버튼 클릭 이벤트 추가
						e.preventDefault()
						translate(selectionString)
						// console.log('button click')
					})
				}
			}
		}, 0)
		// console.log('mouseup')
	})
})

browser.runtime.onMessage.addListener((message) => { // 메시지 수신
	if (message[0] === 'translate') {
		translate(selectionStringGet())
	}
})

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

function translate (selectionString) {
	if (!selectionString) return
	let resultData = ''
	$(`.${name1}`).remove()
	$('html body').append(htmlpopup()) // 팝업 레이어 추가
	let wiwidth = window.innerWidth - 400
	let wiheight = window.innerHeight - 300
	if (x > wiwidth) x = wiwidth
	if (y > wiheight) y = wiheight
	if (x < 0) x = 0
	if (y < 0) y = 0
	$(`#${name1}-page`).css('left', x + 10) // 마우스 좌표로 이동
	$(`#${name1}-page`).css('top', y + 10)
	$(`#${name1}-data1`).text(selectionString)
	$(`#${name1}-page`).draggable({ scroll: false, cancel: `#${name1}-data1` }) // 드래그 기능
	$.ajax({
		type: 'POST',
		url: 'http://192.168.99.100:5000/googletranslate',
		data: { data: selectionString },
		async: false, // 응답 대기
		success: (response) => {
			resultData = response
		}
	})
	// console.log(resultData)
	// console.log(resultData.data1)
	if (resultData.data2) { // 팝업 데이터 추가
		// console.log(resultData.data2)
		$(`#${name1}-data1`).text(`${resultData.data1}\n\n${resultData.data2}`)
	} else {
		$(`#${name1}-data1`).text(resultData.data1)
	}
	// console.log('popup')
}

function htmlbutton () { // 팝업 생성 버튼
	return `
<div class="${name1}">
	<style>
		.${name1}, .${name1} * {all:initial; }
		.${name1} style {display: none; }
		.${name1} div {display: block; }
	</style>
	<div id="${name1}-button" style="max-width: 100px; max-height: 100px; background-color:rgba(255,255,255,0.5); border: 1px solid; border-radius: 10px; padding: 10px; position: fixed; z-index: 2147483647; top: 50%; left: 50%; overflow: auto; cursor: pointer; ">
	</div>
</div>
`
}

function htmlpopup () { // 팝업 레이어
	return `
<div class="${name1}">
	<style>
		.${name1}, .${name1} * {all:initial; }
		.${name1} style {display: none; }
		.${name1} div {display: block; }
		.${name1} pre {display: block; font-family: monospace !important; white-space: pre; margin: 1em 0; }
	</style>
	<div id="${name1}-page" style="background-color:rgba(255,255,255,0.9); border: 2px solid; border-radius: 20px; padding: 0px; position: fixed; z-index: 2147483647; top: 50%; left: 50%; cursor: move; ">
		<pre id="${name1}-data1" style="white-space: pre-wrap; max-width: 400px; max-height: 300px; margin: 20px; overflow: auto; "></pre>
	</div>
</div>
`
}
