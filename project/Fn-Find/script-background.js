var cssCode = ''
var rgba = ''

let gettingAllCommands = browser.commands.getAll()
gettingAllCommands.then((commands) => {
	for (let command of commands) {
		// Note that this logs to the Add-on Debugger's console: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging
		// not the regular Web console.
		console.log(command)
	}
})
browser.commands.onCommand.addListener((command) => {
	if (command === 'shortcuts') {
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
	let activeTabArray = await browser.tabs.query({
		active: true, currentWindow: true
	})
	let tabId = activeTabArray[0].id

	await browser.tabs.sendMessage(tabId, [string, 0])
}

browser.contextMenus.create({ // 메뉴 생성
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

browser.contextMenus.onClicked.addListener((info) => { // 메뉴 클릭 처리
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
		let version = 'v20191101'
		browser.tabs.executeScript({ code: `alert('${version}')` })
	}
})

browser.runtime.onMessage.addListener((message) => {
	if (message[0] === 'selection string') {
		if (message[1]) {
			browser.find.find(message[1], { includeRectData: true }).then(test3).then(() => {
				browser.find.highlightResults()
			})
		} else {
			browser.find.removeHighlighting()
			sendMessageTab('find')
		}
	}
})

async function test3 (matches) {
	// get the active tab ID
	let activeTabArray = await browser.tabs.query({
		active: true, currentWindow: true
	})
	let tabId = activeTabArray[0].id

	// execute the content script in the active tab
	// await browser.tabs.executeScript(tabId, {file: 'js2.js'})
	// ask the content script to redact matches for us
	await browser.tabs.sendMessage(tabId, ['find', { rects: matches.rectData }])
	// await browser.tabs.sendMessage(tabId, {rects: matches.rectData})
	browser.tabs.insertCSS({ code: '.tmpClass1 {position: fixed; z-index: 999999; left: 98%; width: 1%; height: 5px;}' })
	browser.tabs.removeCSS({ code: cssCode })
	rgba = '255, 0, 0, 0.3'
	cssCode = '.tmpClass1 {background-color: rgba(255, 0, 0, 0.3);}'
	browser.tabs.insertCSS({ code: cssCode })
}
