browser.contextMenus.create({ // 컨텍스트 메뉴 생성
	id: 'translate',
	title: 'translate',
	contexts: ['selection']
})
browser.contextMenus.create({
	id: 'version',
	title: 'version',
	contexts: ['all']
})

browser.contextMenus.onClicked.addListener((info) => { // 컨텍스트 메뉴 동작
	if (info.menuItemId === 'translate') {
		sendMessageTab('translate')
	} else if (info.menuItemId === 'version') {
		let version = 'v20191223'
		browser.tabs.executeScript({ code: `alert('${version}')` })
	}
})

async function sendMessageTab (string) { // 활성 탭으로 메시지 발신
	let activeTabArray = await browser.tabs.query({
		active: true, currentWindow: true
	})
	let tabId = activeTabArray[0].id

	await browser.tabs.sendMessage(tabId, [string, 0])
}
