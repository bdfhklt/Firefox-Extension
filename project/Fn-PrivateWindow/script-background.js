let targetWindowId = browser.windows.WINDOW_ID_NONE
let menu1

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

browser.menus.onShown.addListener((menuInfo, tabInfo) => { // 컨텍스트 메뉴 감지
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

browser.menus.onClicked.addListener((menuInfo, tabInfo) => { // 컨텍스트 메뉴 동작
	// console.log(menuInfo)
	// console.log(tabInfo)
	switch (menuInfo.menuItemId) {
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
					browser.windows.update(targetWindowId, {
						state: 'minimized'
					})
				}, 1000)
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
