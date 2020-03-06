let responseJSONArray = []

browser.menus.create({ // 컨텍스트 메뉴 생성
	id: 'translate',
	title: 'translate',
	contexts: ['selection']
})
browser.menus.create({
	id: 'notification',
	title: 'notification',
	contexts: ['all']
})
browser.menus.create({
	id: 'test1',
	title: 'test1',
	contexts: ['all']
})
browser.menus.create({
	id: 'test2',
	title: 'test2',
	contexts: ['all']
})
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
	if (info.menuItemId === 'translate') {
		sendMessageTab('translate')
	} else if (info.menuItemId === 'notification') {
		let tmp1 = ''
		for (let i1 = 1; i1 <= 20; i1++) {
			let tmp2 = ''
			for (let i2 = 0; i2 < 10 - String(i1).length; i2++) {
				tmp2 += 'a'
			}
			tmp1 += tmp2 + i1
		}
		browser.notifications.create(
			'notification id1',
			{
				type: 'basic',
				title: tmp1,
				message: tmp1 // 최대 200char
			}
		)
	} else if (info.menuItemId === 'test1') {
		translateRequest(info.selectionText)
		// browser.notifications.create(
		// 	'notification id1',
		// 	{
		// 		type: 'basic',
		// 		title: 'title1',
		// 		message: 'message1'
		// 	}
		// )
	} else if (info.menuItemId === 'test2') {
		console.log(tab)
	} else if (info.menuItemId === 'version') {
		let version = 'v20200212'
		browser.tabs.executeScript({ code: `alert('${version}')` })
	}
})

browser.runtime.onMessage.addListener((message, sender, sendResponse) => { // 메시지 리스너
	if (message.id === 'translate') {
		console.log(message)
		console.log(sender)
		translateRequest(message.selectionText, () => {
			sendResponse(responseJSONArray)
		})
		return true // 'return true' 비동기
	}
})

async function sendMessageTab (string) { // 활성 탭으로 메시지
	let activeTabArray = await browser.tabs.query({
		active: true, currentWindow: true
	})
	let tabId = activeTabArray[0].id

	await browser.tabs.sendMessage(tabId, { id: string })
}

function tkkRequest (loadendFunction) { // tkk 요청
	let xhr = new XMLHttpRequest()
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// tkk:'439260.900540207'
			setTkk(/\d+\.\d+/.exec(/tkk:'\d+\.\d+'/.exec(xhr.responseText)[0])[0])
			console.log(getTkk())
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
				if (responseJSONArray.unshift(JSON.parse(response)) > 5) {
					responseJSONArray.pop()
				}
				// console.log(response)
				// console.log(JSON.parse(response))
				console.log(responseJSONArray)
			} else {
				message = 'error'
			}
		}
		xhr.open('POST', `https://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=ko&hl=ko&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&otf=1&ssel=0&tsel=0&kc=1&tk=${getTk(request)}`, true)
		xhr.setRequestHeader(requestHeader[0], requestHeader[1])
		xhr.send(`q=${encodeURIComponent(request)}`)
		xhr.onloadend = () => {
			browser.notifications.create(
				'notification id1',
				{
					type: 'basic',
					title: 'translate',
					message: message
				}
			)
			if (loadendFunction) loadendFunction()
		}
	}
}
