// ==UserScript==
// @name         public / ComfyUI frontend
// @version      1.0.3.20250513.10
// @downloadURL  http://localhost:5000/user-script?file-name=comfyui-frontend
// @include      http://127.0.0.1:8188/
// @grant        none
// ==/UserScript==


/*
https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
execCommand() 지원 중단됨; 아직 사용가능하며 사용 불가시 대체용 코드로 변경

execCommand()  --> undo(ctrl+z) 가능
setRangeText() --> undo(ctrl+z) 불가
*/


// textarea에서 텍스트 드래그 앤 드롭 비활성화 해제
document.body.addEventListener('drop', (event) => {
	if (event.target && event.target.type === 'textarea') event.stopPropagation()
})

// 텍스트 영역의 단축키 기능
document.body.addEventListener('keydown', (event) => {
	if (event.target && event.target.type === 'textarea' && event.target.readOnly === false) {
		const textarea = event.target

		// 텍스트 주석 처리
		if (event.ctrlKey && event.key === '/') {
			event.preventDefault()

			const { selectionStart, selectionEnd, value } = textarea
			const hasSelection = selectionStart !== selectionEnd

			if (hasSelection) {
				const selected = value.slice(selectionStart, selectionEnd)

				if (!selected.includes('\n')) {
					// 한 줄짜리 선택 → 블록 주석 토글
					if (selected.startsWith('/* ') && selected.endsWith(' */')) {
						// 주석 제거
						const uncommented = selected.slice(3, -3)
						textarea.setSelectionRange(selectionStart, selectionEnd)
						document.execCommand('insertText', false, uncommented)
						textarea.setSelectionRange(selectionStart, selectionEnd - 6)
						// execCommand 지원 중단 대체용
						// textarea.setRangeText(uncommented, selectionStart, selectionEnd, 'select')
					} else {
						// 주석 추가
						textarea.setSelectionRange(selectionStart, selectionEnd)
						document.execCommand('insertText', false, `/* ${selected} */`)
						textarea.setSelectionRange(selectionStart, selectionEnd + 6)
						// execCommand 지원 중단 대체용
						// textarea.setRangeText(`/* ${selected} */`, selectionStart, selectionEnd, 'select')
					}
				} else {
					// 여러 줄 선택 → 줄 주석 토글 (줄 전체를 기준으로 맨 앞에 주석 토글)
					const startLineIdx = value.lastIndexOf('\n', selectionStart - 1) + 1
					const endLineIdx = value.indexOf('\n', selectionEnd)
					const realEndIdx = endLineIdx === -1 ? value.length : endLineIdx

					const block = value.slice(startLineIdx, realEndIdx)
					const lines = block.split('\n')

					const allCommented = lines.every(line => line.startsWith('//'))
					const newLines = lines.map(line =>
						allCommented
							? line.replace(/^\/\/\s?/, '')	// 맨 앞에 주석 제거
							: `// ${line}`					// 맨 앞에 주석 추가
					)
					const newText = newLines.join('\n')

					textarea.setSelectionRange(startLineIdx, realEndIdx)
					document.execCommand('insertText', false, newText)
					textarea.setSelectionRange(startLineIdx, startLineIdx + newText.length)
					// execCommand 지원 중단 대체용
					// textarea.setRangeText(newText, startLineIdx, realEndIdx, 'select')
				}
			} else {
				// 선택 없음
				const before = value.slice(0, selectionStart)
				// const after = value.slice(selectionStart)
				const lineStart = before.lastIndexOf('\n') + 1
				const lineEnd = value.indexOf('\n', selectionStart)
				const realEnd = lineEnd === -1 ? value.length : lineEnd
				const line = value.slice(lineStart, realEnd)

				// 블록 주석에 커서가 있는 경우 → 제거
				const fullText = textarea.value
				const blockRegex = /\/\*(\s*)([\s\S]*?)(\s*)\*\//g
				let match
				let inBlock = false

				while ((match = blockRegex.exec(fullText)) !== null) {
					const matchStart = match.index
					const matchEnd = match.index + match[0].length
					if (selectionStart >= matchStart && selectionStart <= matchEnd) {
						inBlock = true
						// const beforeText = fullText.slice(0, matchStart)
						// const afterText = fullText.slice(matchEnd)
						const leadingSpace = match[1]
						const innerText = match[2]
						const trailingSpace = match[3]
						let newInner = leadingSpace + innerText + trailingSpace

						// 앞뒤 공백 둘 다 있으면 → 한 칸씩 제거
						if (leadingSpace.length > 0 && trailingSpace.length > 0) {
							newInner = newInner.replace(/^\s/, '')
							newInner = newInner.replace(/\s$/, '')
						}

						textarea.setSelectionRange(matchStart, matchEnd)
						document.execCommand('insertText', false, newInner)
						textarea.setSelectionRange(matchStart, matchStart + newInner.length)
						// execCommand 지원 중단 대체용
						// textarea.setRangeText(newInner, matchStart, matchEnd, 'select')
						break
					}
				}

				if (!inBlock) {
					// 줄 주석 토글
					const isCommented = line.trim().startsWith('//')
					const newLine = isCommented
						? line.replace(/^(\s*)\/\/\s?/, '$1') // 주석 제거
						: line.replace(/^(\s*)/, '$1// ') // 주석 추가

					textarea.setSelectionRange(lineStart, realEnd)
					document.execCommand('insertText', false, newLine)
					// execCommand 지원 중단 대체용
					// textarea.setRangeText(newLine, lineStart, realEnd, 'preserve')
					const newPos = selectionStart + (newLine.length - line.length)
					if (newPos < lineStart) {
						// 커서가 줄 시작보다 앞에 있는 경우 → 줄 시작으로 이동
						textarea.setSelectionRange(lineStart, lineStart)
					} else textarea.setSelectionRange(newPos, newPos)
				}
			}
		}
	}
})

