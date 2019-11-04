browser.contextMenus.create({ // 메뉴 생성
	id: 't1',
	title: 't1',
	contexts: ['all']
})
browser.contextMenus.create({
	id: 'version',
	title: 'version',
	contexts: ['all']
})

browser.contextMenus.onClicked.addListener((info) => { // 메뉴 클릭 처리
	if (info.menuItemId === 't1') {
		browser.tabs.insertCSS({ code: '.testClass1 {position: fixed; z-index: 999999; top: 10%; left: 10%}' })
		sendMessageTab('test')
	} else if (info.menuItemId === 'version') {
		let version = 'v20191104'
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
