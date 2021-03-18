async function updateUI () {
	let tmp1 = document.querySelectorAll('table tr')
	for (const element of tmp1) { // 단축키 테이블 비우기
		element.remove()
	}
	let commands = await browser.commands.getAll()
	for (const [index, command] of commands.entries()) { // 단축키 테이블 작성
		let clone = document.querySelector('template').content.cloneNode(true)
		let tmp2 = clone.querySelector('label')
		tmp2.setAttribute('for', `input${index}`)
		tmp2.innerText = command.description
		tmp2 = clone.querySelector('input')
		tmp2.setAttribute('id', `input${index}`)
		tmp2.value = command.shortcut
		clone.querySelector('button').addEventListener('click', () => {
			resetShortcut(command.name)
		})
		document.querySelector('body table').appendChild(clone)
	}
}

async function resetShortcut (commandName) {
	await browser.commands.reset(commandName)
	updateUI()
}

document.addEventListener('DOMContentLoaded', updateUI)
