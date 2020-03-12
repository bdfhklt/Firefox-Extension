function saveOptions (event) { // 옵션 세이브
	let obj = {}
	for (const key of Object.keys(options.keys)) {
		const inputValue = document.getElementById(`option-${key}`).value
		obj[key] = valueType(options.keys[key], inputValue)
	}
	browser.storage.local.set(obj)
	setTimeout(() => { // 대기 시간 필요
		restoreOptions()
	}, 50)
}

async function restoreOptions () { // 옵션 로드
	for (const key of Object.keys(options.keys)) {
		const gettingItem = await browser.storage.local.get(key)
		if (gettingItem[key]) {
			document.getElementById(`option-${key}`).value = gettingItem[key]
		}
	}
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('button-save').addEventListener('click', saveOptions)
