let targetWindowId = browser.windows.WINDOW_ID_NONE
let menu1 = null

browser.menus.create({ // 컨텍스트 메뉴 생성
	id: 'openInPrivateWindow',
	title: 'Open in Private Window',
	contexts: ['link']
})
menu1 = browser.menus.create({
	id: 'setTargetWindow',
	title: 'Set Target Window',
	contexts: ['page'],
	visible: false
})
// browser.menus.create({
// 	id: 't1',
// 	title: 't1',
// 	contexts: ['all']
// })

browser.menus.onShown.addListener((menuInfo, tabInfo) => { // 컨텍스트 메뉴 표시
	// console.log(menuInfo)
	// console.log(tabInfo)
	if (tabInfo.incognito && tabInfo.windowId !== targetWindowId) {
		browser.menus.update(menu1, {
			visible: true
		}).then(() => {
			browser.menus.refresh()
		})
	} else {
		browser.menus.update(menu1, {
			visible: false
		}).then(() => {
			browser.menus.refresh()
		})
	}
})

browser.menus.onClicked.addListener((menuInfo, tabInfo) => { // 컨텍스트 메뉴 클릭
	// console.log(menuInfo)
	// console.log(tabInfo)
	switch (menuInfo.menuItemId) { // 타겟 윈도우에서 열기 또는 지정
	case 'openInPrivateWindow':
		browser.windows.get(targetWindowId).then((windowInfo) => { // 타겟 윈도우 확인
			// console.log(windowInfo)
			browser.tabs.create({
				// active: false,
				windowId: targetWindowId,
				url: menuInfo.linkUrl
			})
		}, (errorMessage) => { // 타겟 윈도우가 없으면
			// console.log(errorMessage)
			browser.windows.create({
				// focused: false // ! 작동 안함(v78.6.0esr)
				incognito: true,
				url: menuInfo.linkUrl
			}).then((windowInfo) => {
				// console.log(windowInfo)
				targetWindowId = windowInfo.id
				browser.windows.update(tabInfo.windowId, {
					focused: true
				})
				setTimeout(() => {
					browser.windows.getCurrent().then((currentWindowInfo) => {
						if (currentWindowInfo.id !== targetWindowId) {
							browser.windows.update(targetWindowId, {
								state: 'minimized'
							})
						}
					})
				}, 4000)
			}, (errorMessage) => {
				// console.log(errorMessage)
			})
		})
		break
	case 'setTargetWindow':
		targetWindowId = tabInfo.windowId
		break
	// case 't1':
	// 	break
	}
})

/*
browser.tabs.onCreated.addListener((tabInfo) => { // 새탭 열림
	// console.log(tabInfo)
	// setTimeout(() => {
	// 	browser.tabs.get(tabInfo.id).then((tabInfo2) => {
	// 		console.log(tabInfo2)
	// 	})
	// 	browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
	// 		console.log(tabId)
	// 		console.log(changeInfo)
	// 		console.log(tabInfo)
	// 	})
	// }, 1000)

	// if (tabInfo.incognito && tabInfo.title === '사생활 보호 모드') { // private 창
	// 	browser.tabs.update(tabInfo.id, { url: 'about:blank' }).then(() => {
	// 		browser.tabs.reload(tabInfo.id)
	// 	})
	// }
	browser.tabs.onUpdated.addListener(tabUpdateListener, { properties: ['url'] })
	browser.tabs.onUpdated.addListener(temp1)
	v1 = false
})

function tabUpdateListener (tabId, changeInfo, tabInfo) {
	browser.tabs.onUpdated.removeListener(tabUpdateListener)
	// console.log(tabId)
	// console.log(changeInfo)
	// console.log(tabInfo)
	if (changeInfo.url === 'about:privatebrowsing') {
		browser.tabs.update(tabId, { url: 'about:blank' }).then(() => {
			console.log('update')

			// setTimeout(() => {
			// 	browser.tabs.reload(tabId, { bypassCache: true })
			// }, 15)
			// setTimeout(() => {
			// 	browser.tabs.update(tabId, { url: 'about:newtab' }).then(() => {
			// 		setTimeout(() => {
			// 			browser.tabs.reload(tabId)
			// 		}, 500)
			// 	})
			// }, 500)
		})
	}
}

let v1 = false

function temp1 (tabId, changeInfo, tabInfo) {
	// browser.tabs.onUpdated.removeListener(temp1)
	console.log(tabId)
	console.log(changeInfo)
	console.log(tabInfo)
	// browser.tabs.reload(tabId)

	// if (tabInfo.incognito && changeInfo.url === 'about:blank') {
	if (changeInfo.status === 'loading' && v1) {
	// if (tabInfo.incognito && changeInfo.status === 'complete') {
		browser.tabs.onUpdated.removeListener(temp1)
		console.log('ok')
		browser.tabs.reload(tabId, { bypassCache: true })
	}
	if (changeInfo.status === 'loading' && changeInfo.url === 'about:privatebrowsing') v1 = true
}
*/
