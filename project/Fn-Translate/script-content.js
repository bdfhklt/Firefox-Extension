$(() => { // 자동시작
	// alert('test')
})

browser.runtime.onMessage.addListener((message) => {
	if (message[0] === 't1') {
		var selectString = window.getSelection().toString()
		console.log(selectString)
		var resultData = ''
		$.ajax({
			type: 'POST',
			url: 'http://192.168.99.100:5000/googletranslate',
			data: { data: selectString },
			success: (result) => {
				resultData = result
			}
		}).then(() => {
			console.log(resultData)
			console.log(resultData.data1)
			if (resultData.data2) {
				console.log(resultData.data2)
			}
		})
	} else if (message[0] === 't2') {
		aaa = '123456789'
		$('html body').append(popuphtml(aaa))
		console.log('popup test')
		$('.popup-translate').draggable({ scroll: false }) // 드래그 기능
	}
})

var aaa = ''
function popuphtml (message) { // 팝업 페이지
	return `
<div class=popup-translate width="400" height="300">
	${message}
</div>
`
}
