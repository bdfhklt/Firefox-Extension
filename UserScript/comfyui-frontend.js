// ==UserScript==
// @name         public / ComfyUI frontend
// @version      1.0.1.20250507.14
// @downloadURL  http://localhost:5000/user-script?file-name=comfyui-frontend
// @include      http://127.0.0.1:8188/
// @grant        none
// ==/UserScript==


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
						textarea.setRangeText(uncommented, selectionStart, selectionEnd, 'end')

						// 선택 영역
						textarea.setSelectionRange(selectionStart, selectionStart + uncommented.length)
					} else {
						// 주석 추가
						textarea.setRangeText(`/* ${selected} */`, selectionStart, selectionEnd, 'end')

						// 선택 영역
						textarea.setSelectionRange(selectionStart, selectionEnd + 6)
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

					// 줄 전체를 새 텍스트로 교체
					textarea.setRangeText(newText, startLineIdx, realEndIdx, 'end')

					// 선택 영역
					textarea.setSelectionRange(startLineIdx, startLineIdx + newText.length)
				}
			} else {
				// 선택 없음
				const before = value.slice(0, selectionStart)
				const after = value.slice(selectionStart)
				const lineStart = before.lastIndexOf('\n') + 1
				const lineEnd = value.indexOf('\n', selectionStart)
				const realEnd = lineEnd === -1 ? value.length : lineEnd
				const line = value.slice(lineStart, realEnd)

				// 블록 주석에 커서가 있는 경우 → 제거
				const blockStart = before.lastIndexOf('/*')
				const blockEnd = after.indexOf('*/')

				if (blockStart !== -1 && blockEnd !== -1 && blockStart < selectionStart && (selectionStart + blockEnd + 2) <= value.length) {
					const fullText = textarea.value
					const blockRegex = /\/\*(\s*)([\s\S]*?)(\s*)\*\//g
					let match

					while ((match = blockRegex.exec(fullText)) !== null) {
						const matchStart = match.index
						const matchEnd = match.index + match[0].length

						if (selectionStart >= matchStart && selectionStart <= matchEnd) {
							const beforeText = fullText.slice(0, matchStart)
							const afterText = fullText.slice(matchEnd)

							const leadingSpace = match[1] // '/*' 뒤 공백
							const innerText = match[2] // 실제 내용
							const trailingSpace = match[3] // '*/' 앞 공백

							let newInner = leadingSpace + innerText + trailingSpace

							// 공백 없거나 한쪽만 있음 → pass
							// 앞뒤 공백 있음 → 앞뒤 한 칸씩 제거
							if (leadingSpace.length > 0 && trailingSpace.length > 0) {
								newInner = newInner.replace(/^\s/, '')
								newInner = newInner.replace(/\s$/, '')
							}

							textarea.value = beforeText + newInner + afterText

							const newPos = matchStart + newInner.length
							textarea.setSelectionRange(newPos, newPos)
							break
						}
					}
				} else {
					// 줄 주석 토글
					const isCommented = line.trim().startsWith('//')
					const newLine = isCommented
						? line.replace(/^(\s*)\/\/\s?/, '$1') // 주석 제거
						: line.replace(/^(\s*)/, '$1// ') // 주석 추가

					textarea.value = value.slice(0, lineStart) + newLine + value.slice(realEnd)
					const newPos = selectionStart + (newLine.length - line.length)
					textarea.setSelectionRange(newPos, newPos)
				}
			}
		}
	}
})

