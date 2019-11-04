$(() => { // 자동시작
	// alert('test')
})

browser.runtime.onMessage.addListener((message) => {
	if (message[0] === 'test') {
		let tmp = document.createElement('div')
		tmp.className = 'testClass1'
		document.body.appendChild(tmp)
		$('.testClass1').html('<object data="https://translate.google.co.kr/?hl=ko" width="800px" height="600px" style="overflow:auto;border:5px ridge blue"/>')
		console.log('test')
	}
})
