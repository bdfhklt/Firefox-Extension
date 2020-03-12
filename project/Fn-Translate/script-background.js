let responseJSONArr = []

browser.menus.create({ // 컨텍스트 메뉴 생성
	id: 'translate',
	title: 'translate',
	contexts: ['selection']
})
browser.menus.create({
	id: 'storage',
	title: 'storage',
	contexts: ['all']
})
// browser.menus.create({
// 	id: 'test1',
// 	title: 'test1',
// 	contexts: ['all']
// })
// browser.menus.create({
// 	id: 'test2',
// 	title: 'test2',
// 	contexts: ['all']
// })
browser.menus.create({
	id: 'version',
	title: 'version',
	contexts: ['all']
})

browser.menus.onClicked.addListener((info, tab) => { // 컨텍스트 메뉴 동작
	// console.log(info)
	// console.log(tab)
	// console.log(info.selectionText)
	// console.log(tab.id)
	switch (info.menuItemId) {
	case 'translate':
		browser.tabs.sendMessage(tab.id, { id: 'translate' }).catch(error => { // error 처리
			console.log(error.toString())
			translateRequest(info.selectionText, () => {
				let tempString = ''
				if (responseJSONArr[0][0]) { // 번역
					responseJSONArr[0][0].forEach(arrElement => {
						if (arrElement[0]) tempString += arrElement[0]
					})
				}
				if (responseJSONArr[0][1]) { // 단어 번역, 품사
					responseJSONArr[0][1].forEach(arrElement1 => {
						tempString += `\n\n${arrElement1[0]}\n`
						let oneTimeFalse = false
						arrElement1[1].forEach(arrElement2 => {
							if (oneTimeFalse) {
								tempString += ', '
							} else oneTimeFalse = true
							tempString += arrElement2
						})
					})
				}
				browser.notifications.create( // 알림 생성
					'notification id1',
					{
						type: 'basic',
						title: 'translate',
						message: tempString // 최대 200char
					}
				)
			})
		})
		break
	case 'storage':
		browser.tabs.sendMessage(tab.id, { id: 'storage' })
		break
	// case 'test1':
	// 	break
	// case 'test2':
	// 	break
	case 'version': {
		const version = 'v20200312'
		browser.tabs.executeScript({ code: `alert('${version}')` }).catch(error => {
			console.log(error.toString())
			console.log(version)
		})
		break }
	}
})

browser.runtime.onMessage.addListener((message, sender, sendResponse) => { // 메시지 리스너
	if (message.id === 'translate') {
		// console.log(message)
		// console.log(sender)
		if (message.selectionText) {
			translateRequest(message.selectionText, () => {
				sendResponse(responseJSONArr)
			})
		} else {
			sendResponse(responseJSONArr)
		}
		return true // 'return true': 비동기
	}
})

// async function sendMessageTab (string) { // 활성 탭으로 메시지
// 	let activeTabs = await browser.tabs.query({
// 		active: true, currentWindow: true
// 	})
// 	let tabId = activeTabs[0].id

// 	await browser.tabs.sendMessage(tabId, { id: string })
// }

function tkkRequest (loadendFunction) { // tkk 요청
	let xhr = new XMLHttpRequest()
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// tkk:'439260.900540207'
			setTkk(/\d+\.\d+/.exec(/tkk:'\d+\.\d+'/.exec(xhr.responseText)[0])[0])
			// console.log(getTkk())
		}
	}
	xhr.open('GET', 'https://translate.google.com/', true)
	xhr.send()
	xhr.onloadend = () => {
		if (getTkk()) {
			if (loadendFunction) loadendFunction()
		} else {
			browser.notifications.create(
				'notification id1',
				{
					type: 'basic',
					title: 'translate',
					message: 'tkk error'
				}
			)
		}
	}
}

function translateRequest (request, loadendFunction) { // 번역 요청
	if (!getTkk()) {
		tkkRequest(translate)
	} else {
		translate()
	}

	function translate () {
		request = request.trim()
		// console.log(request)
		// console.log(encodeURIComponent(request))
		let response = ''
		let message = ''
		let xhr = new XMLHttpRequest()
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				response = xhr.responseText
				message = response
				if (responseJSONArr.unshift(JSON.parse(response)) > 5) {
					responseJSONArr.pop()
				}
				// console.log(response)
				// console.log(JSON.parse(response))
				// console.log(responseJSONArr)
			} else {
				message = 'error'
			}
		}
		xhr.open('POST', `https://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=ko&hl=ko&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&otf=1&ssel=0&tsel=0&kc=1&tk=${getTk(request)}`, true)
		xhr.setRequestHeader(translateRequestHeader[0], translateRequestHeader[1])
		xhr.send(`q=${encodeURIComponent(request)}`)
		xhr.onloadend = () => {
			if (message === 'error') {
				browser.notifications.create(
					'notification id1',
					{
						type: 'basic',
						title: 'translate',
						message: message
					}
				)
			}
			if (loadendFunction) loadendFunction()
		}
	}
}
