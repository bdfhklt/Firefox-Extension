// ==UserScript==
// @name         public / Stable Diffusion WebUI
// @version      1.0.0.20250424.0
// @downloadURL  http://localhost:5000/user-script?file-name=stable-diffusion-webui
// @include      http://127.0.0.1:7860/
// @grant        none
// ==/UserScript==



// CSS
document.head.appendChild(document.createElement('style')).innerHTML = (`
#txt2img_prompt textarea,${'' /* txt2img 프롬프트 textarea */}
#txt2img_neg_prompt textarea,
#script_txt2img_adetailer_ad_prompt textarea,${'' /* A디테일러 프롬프트 textarea */}
#script_txt2img_adetailer_ad_negative_prompt textarea {
	scrollbar-width: auto;
}
`
)

