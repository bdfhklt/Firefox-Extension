// browser.runtime.onMessage.addListener((message) => { // 메시지 수신
// 	switch (message.id) {
// 	case 't1':
// 		console.log(message.data)
// 		break
// 	}
// })

(() => {
	if (document.location.href.includes('store.steampowered.com/app')) {
		window.addEventListener('beforeunload', (event) => { // 이벤트 리스너
			// event.preventDefault()
			// console.log(event)
			browser.runtime.sendMessage('beforeunload') // 백그라운드로 메시지 발신
		})
	}
})()
