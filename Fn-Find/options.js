const command1 = 'shortcuts'

async function updateUI () {
	let commands = await browser.commands.getAll()
	for (command of commands) {
		if (command.name === command1) {
			document.querySelector('#shortcut1').value = command.shortcut
		}
	}
}

async function updateShortcut () {
	await browser.commands.update({
		name: command1,
		shortcut: document.querySelector('#shortcut1').value
	})
}
async function resetShortcut () {
	await browser.commands.reset(command1)
	updateUI()
}

document.addEventListener('DOMContentLoaded', updateUI)

document.querySelector('#update').addEventListener('click', updateShortcut)
document.querySelector('#reset').addEventListener('click', resetShortcut)
