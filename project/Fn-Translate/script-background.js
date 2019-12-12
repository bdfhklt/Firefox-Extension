browser.contextMenus.create({ // 메뉴 생성
	id: 't1',
	title: 't1',
	contexts: ['selection']
})
browser.contextMenus.create({
	id: 't2',
	title: 't2',
	contexts: ['all']
})
browser.contextMenus.create({
	id: 'version',
	title: 'version',
	contexts: ['all']
})

browser.contextMenus.onClicked.addListener((info) => { // 메뉴 클릭 처리
	if (info.menuItemId === 't1') {
		sendMessageTab('t1')
	} else if (info.menuItemId === 't2') {
		sendMessageTab('t2')
		browser.tabs.insertCSS({ code: '.popup-translate {border: 5px solid; position: fixed; z-index: 999999; top: 50%; left: 50%}' })
	} else if (info.menuItemId === 'version') {
		let version = 'v20191202'
		browser.tabs.executeScript({ code: `alert('${version}')` })
	}
})

async function sendMessageTab (string) {
	let activeTabArray = await browser.tabs.query({
		active: true, currentWindow: true
	})
	let tabId = activeTabArray[0].id

	await browser.tabs.sendMessage(tabId, [string, 0])
}
