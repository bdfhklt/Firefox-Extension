class Counter { // 카운터
	constructor () {
		this.count = 0
		this.activate = false
	}

	countDown () { // 카운트 다운
		if (!this.activate) {
			this.activate = !this.activate
			const interval = setInterval(() => {
				// console.log(this.count)
				if (this.count <= 0) {
					this.activate = false
					clearInterval(interval)
				} else {
					this.count--
				}
			}, 1000)
		}
	}
}

const counter = new Counter()
let activate = false;

(() => {
	getStorage()
})()

browser.menus.create({ // 컨텍스트 메뉴 생성
	id: 'activate',
	type: 'checkbox',
	title: 'activate',
	contexts: ['all'],
	checked: activate
})
browser.menus.create({
	id: 'starting',
	title: 'starting',
	contexts: ['all']
})
// browser.menus.create({
// 	id: 't1',
// 	title: 't1',
// 	contexts: ['all']
// })
browser.menus.create({
	id: 'version',
	title: 'version',
	contexts: ['all']
})

browser.menus.onClicked.addListener(async (info, tab) => { // 컨텍스트 메뉴 동작
	console.log(tab)
	switch (info.menuItemId) {
	case 'activate':
		activate = !activate
		break
	case 'starting': {
		activate = true
		browser.menus.update('activate', { checked: activate })
		const tmp1 = await browser.tabs.query({ active: true, currentWindow: true })
		for (let i = 0; i < options.values.maxTabs; i++) {
			setTimeout(() => {
				if (activate) {
					createTab(tmp1[0].windowId)
				}
			}, 1000 * options.values.delay * i)
		}
		break }
	// case 't1': {
	// 	// sendMessageTab('t1', 'test')
	// 	console.log(options)
	// 	break }
	case 'version': {
		const version = 'v20191228'
		browser.tabs.executeScript({ code: `alert('${version}')` })
		break }
	}
})

browser.runtime.onMessage.addListener(async (request, sender) => { // 메시지 수신
	if (activate && request === 'beforeunload') {
		const tmp1 = await tabQuery()
		// console.log(tmp1)
		setTimeout(async () => {
			const tmp2 = await tabQuery()
			// console.log(tmp2)
			if (tmp1 !== tmp2) { // 탭 닫기 확인
				setTimeout(() => {
					if (activate) {
						createTab(sender.tab.windowId)
					}
				}, 1000 * counter.count)
				counter.count += options.values.delay // 딜레이 추가
				counter.countDown() // 카운트다운
			}
		}, 1000)
		// sendMessageTab('t1', await tabQuery())
	}
	// console.log(request)
	// console.log(sender)
})

browser.storage.onChanged.addListener((e) => { // 옵션 변경 감지
	// console.log(e)
	getStorage()
})

// async function sendMessageTab (id, data) { // 활성 탭으로 메시지 발신
// 	const activeTabArray = await browser.tabs.query({
// 		active: true, currentWindow: true
// 	})
// 	const tabId = activeTabArray[0].id

// 	await browser.tabs.sendMessage(tabId, { id: id, data: data })
// }

async function tabQuery () { // 활성창 탭 개수
	const tmp1 = await browser.tabs.query({
		currentWindow: true
	})
	return tmp1.length
}

function createTab (windowId) {
	browser.tabs.create({
		active: false,
		index: 10,
		url: 'https://store.steampowered.com/explore/random/',
		windowId: windowId
	})
}
