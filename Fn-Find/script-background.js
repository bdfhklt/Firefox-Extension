let cssCode = ''
let rgba = ''

browser.commands.onCommand.addListener((command) => { // 단축키 사용
	if (command === 'shortcut1') {
		// browser.tabs.executeScript({code:
		//  'var tmp1 = []'
		// + 'tmp1.push(\'find\')'
		// + 'tmp1.push(window.getSelection().toString())'
		// + 'var sending = browser.runtime.sendMessage(tmp1)'
		// })

		// var sending = browser.runtime.sendMessage(tabId, 'find start')

		sendMessageTab('get selection')
	}
})

async function sendMessageTab (string) {
	let activeTabs = await browser.tabs.query({
		active: true, currentWindow: true
	})
	let tabId = activeTabs[0].id

	await browser.tabs.sendMessage(tabId, [string, 0])
}

browser.contextMenus.create({ // 컨텍스트 메뉴 생성
	id: 'find',
	title: 'find',
	contexts: ['selection']
})
browser.contextMenus.create({
	id: 'remove',
	title: 'remove',
	contexts: ['all']
})
browser.contextMenus.create({
	id: 'color',
	title: 'color',
	contexts: ['all']
})
browser.contextMenus.create({
	id: 'version',
	title: 'version',
	contexts: ['all']
})

browser.contextMenus.onClicked.addListener((info) => { // 메뉴 클릭
	if (info.menuItemId === 'find') {
		sendMessageTab('get selection')
	} else if (info.menuItemId === 'remove') {
		browser.find.removeHighlighting()
		sendMessageTab('find')
	} else if (info.menuItemId === 'color') {
		browser.tabs.removeCSS({ code: cssCode })
		if (rgba === '0, 255, 0, 0.3') {
			rgba = '255, 0, 0, 0.3'
		} else if (rgba === '255, 0, 0, 0.3') {
			rgba = '0, 255, 0, 0.3'
		}
		cssCode = `.tmpClass1 {background-color: rgba(${rgba})}`
		browser.tabs.insertCSS({ code: cssCode })
	} else if (info.menuItemId === 'version') {
		let version = 'v20191216'
		browser.tabs.executeScript({ code: `alert('${version}')` })
	}
})

browser.runtime.onMessage.addListener(async (message) => {
	if (message[0] === 'selection string') {
		if (message[1]) {
			await browser.find.find(message[1], { includeRectData: true }).then(test3)
			browser.find.highlightResults()
		} else {
			browser.find.removeHighlighting()
			sendMessageTab('find')
		}
	}
})

async function test3 (matches) {
	// get the active tab ID
	let activeTabs = await browser.tabs.query({
		active: true, currentWindow: true
	})
	let tabId = activeTabs[0].id

	// execute the content script in the active tab
	// await browser.tabs.executeScript(tabId, {file: 'js2.js'})
	// ask the content script to redact matches for us
	await browser.tabs.sendMessage(tabId, ['find', { rects: matches.rectData }])
	// await browser.tabs.sendMessage(tabId, {rects: matches.rectData})
	browser.tabs.insertCSS({ code: '.tmpClass1 {position: fixed; z-index: 2147483647; left: 98%; width: 1%; height: 5px;}' })
	browser.tabs.removeCSS({ code: cssCode })
	rgba = '255, 0, 0, 0.3'
	cssCode = '.tmpClass1 {background-color: rgba(255, 0, 0, 0.3);}'
	browser.tabs.insertCSS({ code: cssCode })
}
