// ==UserScript==
// @name         public / page manager
// @version      1.0.0.20240810.4
// @downloadURL  http://localhost:5000/user-script?file-name=page-manager
// @include      *
// @grant        none
// @run-at       document-start
// ==/UserScript==

// config
const IMAGE_REFRESH_INTERVAL = 2000
const IMAGE_REFRESH_COUNT = 3


// 이미지 리프레시
document.addEventListener('DOMContentLoaded', function () {
	for (const image of document.querySelectorAll('img')) {
		image.addEventListener('error', () => {
			if (!image.hasAttribute('data-refresh-count')) {
				image.setAttribute('data-refresh-count', '0')
			}

			let refreshCount = parseInt(image.getAttribute('data-refresh-count'))

			if (refreshCount < IMAGE_REFRESH_COUNT) {
				refreshCount++
				image.setAttribute('data-refresh-count', refreshCount.toString())

				setTimeout(() => {
					// eslint-disable-next-line no-self-assign
					image.src = image.src
				}, IMAGE_REFRESH_INTERVAL)
			}
		})
	}
})
