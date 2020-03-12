class MainProcess {
	constructor () {
		this.count = 0
		this.activated = false
		this.interval = null
	}

	async activateInterval (windowId) {
		if (activated) {
			const targetWindowTabs = await browser.tabs.query({ windowId: windowId }) // 탭 수 체크
			// console.log(targetWindowTabs)
			let count = 0
			targetWindowTabs.forEach(element => {
				if (element.url.includes('store.steampowered.com/app')) {
					count++
				}
			})
			// console.log(count)
			// console.log(options.values.maxTabs)
			if (count < options.values.maxTabs) {
				this.count = options.values.maxTabs - count
				if (!this.activated && this.count) {
					this.activated = true
					createTab()
					this.count--
					this.interval = setInterval(() => {
						if (this.count > 0) {
							createTab()
							this.count--
						} else {
							this.deactivateInterval()
						}
					}, options.values.delay * 1000)
				}
			}
		}

		function createTab () {
			browser.tabs.create({
				active: false,
				index: 10,
				url: 'https://store.steampowered.com/explore/random/',
				windowId: windowId
			})
		}
	}

	deactivateInterval () {
		clearInterval(this.interval)
		this.activated = false
	}
}

const mainProcess = new MainProcess()
let activated = false;

(() => {
	getStorage()
})()

browser.menus.create({ // 컨텍스트 메뉴 생성
	id: 'activated',
	type: 'checkbox',
	title: 'activated',
	contexts: ['all'],
	checked: activated
})
browser.menus.create({
	id: 'activate',
	title: 'activate',
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

browser.menus.onClicked.addListener((info, tab) => { // 컨텍스트 메뉴 동작
	// console.log(info)
	// console.log(tab)
	switch (info.menuItemId) {
	case 'activated':
		if (activated) mainProcess.deactivateInterval()
		activated = !activated
		break
	case 'activate': {
		activated = true
		browser.menus.update('activated', { checked: activated })
		mainProcess.activateInterval(tab.windowId)
		break }
	// case 't1': {
	// 	(async () => {
	// 		const targetWindowTabs = await browser.tabs.query({
	// 			windowId: tab.windowId
	// 		})
	// 		console.log(targetWindowTabs)
	// 	})()
	// 	break }
	case 'version': {
		const version = 'v20200309'
		browser.tabs.executeScript({ code: `alert('${version}')` })
		break }
	}
})

browser.runtime.onMessage.addListener(async (request, sender) => { // 메시지 수신
	// console.log(request)
	// console.log(sender)
	if (activated && request === 'beforeunload') {
		mainProcess.activateInterval(sender.tab.windowId)
	}
})

browser.storage.onChanged.addListener((changes) => { // 옵션 변경 감지
	// console.log(changes)
	getStorage()
})
