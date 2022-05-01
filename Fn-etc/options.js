/* global browser */

const options = { // 옵션 초기값
	keys: {
		delay: 25,
		maxTabs: 5
	},
	values: {}
}

async function defaultOption () { // 비어있는 옵션 모두 초기화
	const obj = {}
	for (const key of Object.keys(options.keys)) {
		const gettingItem = await browser.storage.local.get(key)
		if (!gettingItem[key]) {
			obj[key] = options.keys[key] // 옵션이 없으면 초기화
		}
	}
	browser.storage.local.set(obj)
	// console.log('default')
}

// eslint-disable-next-line no-unused-vars
function valueType (defaultValue, value) { // 타입 변환
	const type = typeof defaultValue
	switch (type) {
	case 'number': return Number(value)
	case 'string': return String(value)
	case 'boolean': return Boolean(value)
	}
}

// eslint-disable-next-line no-unused-vars
async function getStorage () { // 옵션 로드
	// console.log('load')
	for (const key of Object.keys(options.keys)) {
		const gettingItem = await browser.storage.local.get(key)
		// console.log(gettingItem)
		if (gettingItem[key]) {
			options.values[key] = gettingItem[key]
		} else {
			await defaultOption() // 옵션이 없으면 초기화
			return
		}
	}
}
