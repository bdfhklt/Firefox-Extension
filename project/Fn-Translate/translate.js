/* eslint-disable */

// { https://translate.google.com/translate/releases/twsfe_w_20200210_RC00/r/js/translate_m_ko.js

// { tkk, tk

// tkk = (eu = null)
// tk = (fu() = function)

var cu=function(a){return function(){return a}},du=function(a,b){for(var c=0;c<b.length-2;c+=3){var d=b.charAt(c+2);d="a"<=d?d.charCodeAt(0)-87:Number(d);d="+"==b.charAt(c+1)?a>>>d:a<<d;a="+"==b.charAt(c)?a+d&4294967295:a^d}return a},eu=null,fu=function(a){if(null!==eu)var b=eu;else{b=cu(String.fromCharCode(84));var c=cu(String.fromCharCode(75));b=[b(),b()];b[1]=c();b=(eu=window[b.join(c())]||"")||""}var d=cu(String.fromCharCode(116));c=cu(String.fromCharCode(107));d=[d(),d()];d[1]=c();c="&"+d.join("")+
"=";d=b.split(".");b=Number(d[0])||0;for(var e=[],f=0,g=0;g<a.length;g++){var k=a.charCodeAt(g);128>k?e[f++]=k:(2048>k?e[f++]=k>>6|192:(55296==(k&64512)&&g+1<a.length&&56320==(a.charCodeAt(g+1)&64512)?(k=65536+((k&1023)<<10)+(a.charCodeAt(++g)&1023),e[f++]=k>>18|240,e[f++]=k>>12&63|128):e[f++]=k>>12|224,e[f++]=k>>6&63|128),e[f++]=k&63|128)}a=b;for(f=0;f<e.length;f++)a+=e[f],a=du(a,"+-a^+6");a=du(a,"+-3^+b+-f");a^=Number(d[1])||0;0>a&&(a=(a&2147483647)+2147483648);a%=1E6;return c+(a.toString()+"."+
(a^b))};

// } tkk, tk

// } https://translate.google.com/translate/releases/twsfe_w_20200210_RC00/r/js/translate_m_ko.js


// { https://translate.google.com

const languageCodeName = {source_code_name:[{code:'auto',name:'언어 감지'},{code:'gl',name:'갈리시아어'},{code:'gu',name:'구자라트어'},{code:'el',name:'그리스어'},{code:'nl',name:'네덜란드어'},{code:'ne',name:'네팔어'},{code:'no',name:'노르웨이어'},{code:'da',name:'덴마크어'},{code:'de',name:'독일어'},{code:'lo',name:'라오어'},{code:'lv',name:'라트비아어'},{code:'la',name:'라틴어'},{code:'ru',name:'러시아어'},{code:'ro',name:'루마니아어'},{code:'lb',name:'룩셈부르크어'},{code:'lt',name:'리투아니아어'},{code:'mr',name:'마라티어'},{code:'mi',name:'마오리어'},{code:'mk',name:'마케도니아어'},{code:'mg',name:'말라가시어'},{code:'ml',name:'말라얄람어'},{code:'ms',name:'말레이어'},{code:'mt',name:'몰타어'},{code:'mn',name:'몽골어'},{code:'hmn',name:'몽어'},{code:'my',name:'미얀마어 (버마어)'},{code:'eu',name:'바스크어'},{code:'vi',name:'베트남어'},{code:'be',name:'벨라루스어'},{code:'bn',name:'벵골어'},{code:'bs',name:'보스니아어'},{code:'bg',name:'불가리아어'},{code:'sm',name:'사모아어'},{code:'sr',name:'세르비아어'},{code:'ceb',name:'세부아노'},{code:'st',name:'세소토어'},{code:'so',name:'소말리아어'},{code:'sn',name:'쇼나어'},{code:'su',name:'순다어'},{code:'sw',name:'스와힐리어'},{code:'sv',name:'스웨덴어'},{code:'gd',name:'스코틀랜드 게일어'},{code:'es',name:'스페인어'},{code:'sk',name:'슬로바키아어'},{code:'sl',name:'슬로베니아어'},{code:'sd',name:'신디어'},{code:'si',name:'신할라어'},{code:'ar',name:'아랍어'},{code:'hy',name:'아르메니아어'},{code:'is',name:'아이슬란드어'},{code:'ht',name:'아이티 크리올어'},{code:'ga',name:'아일랜드어'},{code:'az',name:'아제르바이잔어'},{code:'af',name:'아프리칸스어'},{code:'sq',name:'알바니아어'},{code:'am',name:'암하라어'},{code:'et',name:'에스토니아어'},{code:'eo',name:'에스페란토어'},{code:'en',name:'영어'},{code:'yo',name:'요루바어'},{code:'ur',name:'우르두어'},{code:'uz',name:'우즈베크어'},{code:'uk',name:'우크라이나어'},{code:'cy',name:'웨일즈어'},{code:'ig',name:'이그보어'},{code:'yi',name:'이디시어'},{code:'it',name:'이탈리아어'},{code:'id',name:'인도네시아어'},{code:'ja',name:'일본어'},{code:'jw',name:'자바어'},{code:'ka',name:'조지아어'},{code:'zu',name:'줄루어'},{code:'zh-CN',name:'중국어'},{code:'ny',name:'체와어'},{code:'cs',name:'체코어'},{code:'kk',name:'카자흐어'},{code:'ca',name:'카탈로니아어'},{code:'kn',name:'칸나다어'},{code:'co',name:'코르시카어'},{code:'xh',name:'코사어'},{code:'ku',name:'쿠르드어'},{code:'hr',name:'크로아티아어'},{code:'km',name:'크메르어'},{code:'ky',name:'키르기스어'},{code:'tl',name:'타갈로그어'},{code:'ta',name:'타밀어'},{code:'tg',name:'타지크어'},{code:'th',name:'태국어'},{code:'tr',name:'터키어'},{code:'te',name:'텔루구어'},{code:'ps',name:'파슈토어'},{code:'pa',name:'펀자브어'},{code:'fa',name:'페르시아어'},{code:'pt',name:'포르투갈어'},{code:'pl',name:'폴란드어'},{code:'fr',name:'프랑스어'},{code:'fy',name:'프리지아어'},{code:'fi',name:'핀란드어'},{code:'haw',name:'하와이어'},{code:'ha',name:'하우사어'},{code:'ko',name:'한국어'},{code:'hu',name:'헝가리어'},{code:'iw',name:'히브리어'},{code:'hi',name:'힌디어'}],target_code_name:[{code:'gl',name:'갈리시아어'},{code:'gu',name:'구자라트어'},{code:'el',name:'그리스어'},{code:'nl',name:'네덜란드어'},{code:'ne',name:'네팔어'},{code:'no',name:'노르웨이어'},{code:'da',name:'덴마크어'},{code:'de',name:'독일어'},{code:'lo',name:'라오어'},{code:'lv',name:'라트비아어'},{code:'la',name:'라틴어'},{code:'ru',name:'러시아어'},{code:'ro',name:'루마니아어'},{code:'lb',name:'룩셈부르크어'},{code:'lt',name:'리투아니아어'},{code:'mr',name:'마라티어'},{code:'mi',name:'마오리어'},{code:'mk',name:'마케도니아어'},{code:'mg',name:'말라가시어'},{code:'ml',name:'말라얄람어'},{code:'ms',name:'말레이어'},{code:'mt',name:'몰타어'},{code:'mn',name:'몽골어'},{code:'hmn',name:'몽어'},{code:'my',name:'미얀마어 (버마어)'},{code:'eu',name:'바스크어'},{code:'vi',name:'베트남어'},{code:'be',name:'벨라루스어'},{code:'bn',name:'벵골어'},{code:'bs',name:'보스니아어'},{code:'bg',name:'불가리아어'},{code:'sm',name:'사모아어'},{code:'sr',name:'세르비아어'},{code:'ceb',name:'세부아노'},{code:'st',name:'세소토어'},{code:'so',name:'소말리아어'},{code:'sn',name:'쇼나어'},{code:'su',name:'순다어'},{code:'sw',name:'스와힐리어'},{code:'sv',name:'스웨덴어'},{code:'gd',name:'스코틀랜드 게일어'},{code:'es',name:'스페인어'},{code:'sk',name:'슬로바키아어'},{code:'sl',name:'슬로베니아어'},{code:'sd',name:'신디어'},{code:'si',name:'신할라어'},{code:'ar',name:'아랍어'},{code:'hy',name:'아르메니아어'},{code:'is',name:'아이슬란드어'},{code:'ht',name:'아이티 크리올어'},{code:'ga',name:'아일랜드어'},{code:'az',name:'아제르바이잔어'},{code:'af',name:'아프리칸스어'},{code:'sq',name:'알바니아어'},{code:'am',name:'암하라어'},{code:'et',name:'에스토니아어'},{code:'eo',name:'에스페란토어'},{code:'en',name:'영어'},{code:'yo',name:'요루바어'},{code:'ur',name:'우르두어'},{code:'uz',name:'우즈베크어'},{code:'uk',name:'우크라이나어'},{code:'cy',name:'웨일즈어'},{code:'ig',name:'이그보어'},{code:'yi',name:'이디시어'},{code:'it',name:'이탈리아어'},{code:'id',name:'인도네시아어'},{code:'ja',name:'일본어'},{code:'jw',name:'자바어'},{code:'ka',name:'조지아어'},{code:'zu',name:'줄루어'},{code:'zh-CN',name:'중국어(간체)'},{code:'zh-TW',name:'중국어(번체)'},{code:'ny',name:'체와어'},{code:'cs',name:'체코어'},{code:'kk',name:'카자흐어'},{code:'ca',name:'카탈로니아어'},{code:'kn',name:'칸나다어'},{code:'co',name:'코르시카어'},{code:'xh',name:'코사어'},{code:'ku',name:'쿠르드어'},{code:'hr',name:'크로아티아어'},{code:'km',name:'크메르어'},{code:'ky',name:'키르기스어'},{code:'tl',name:'타갈로그어'},{code:'ta',name:'타밀어'},{code:'tg',name:'타지크어'},{code:'th',name:'태국어'},{code:'tr',name:'터키어'},{code:'te',name:'텔루구어'},{code:'ps',name:'파슈토어'},{code:'pa',name:'펀자브어'},{code:'fa',name:'페르시아어'},{code:'pt',name:'포르투갈어'},{code:'pl',name:'폴란드어'},{code:'fr',name:'프랑스어'},{code:'fy',name:'프리지아어'},{code:'fi',name:'핀란드어'},{code:'haw',name:'하와이어'},{code:'ha',name:'하우사어'},{code:'ko',name:'한국어'},{code:'hu',name:'헝가리어'},{code:'iw',name:'히브리어'},{code:'hi',name:'힌디어'}]}

// } https://translate.google.com


/* memo

GET
https://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=ko&hl=ko&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&otf=1&ssel=0&tsel=0&kc=1&tk=842734.681991&q=%E3%85%81
	https://translate.google.com/translate_a/single
		?client=webapp
		&sl=auto
		&tl=ko
		&hl=ko
		&dt=at
			&dt=bd
			&dt=ex
			&dt=ld
			&dt=md
			&dt=qca
			&dt=rw
			&dt=rm
			&dt=ss
			&dt=t
		&otf=1
		&ssel=0
		&tsel=0
		&kc=1
	v	&tk=842734.681991
	v	&q=%E3%85%81"

POST
https://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=ko&hl=ko&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&otf=1&ssel=0&tsel=0&kc=1&tk=57527.414534
	https://translate.google.com/translate_a/single
		?client=webapp
		&sl=auto
		&tl=ko
		&hl=ko
		&dt=at
			&dt=bd
			&dt=ex
			&dt=ld
			&dt=md
			&dt=qca
			&dt=rw
			&dt=rm
			&dt=ss
			&dt=t
		&otf=1
		&ssel=0
		&tsel=0
		&kc=1
	v	&tk=722893.898087


JSON
array[0] : 번역
array[0][n] : n:짧은 문장, 긴 문장 단위들
array[0][n][0] : * 번역, null check, 줄바꿈 포함 (ex-> "번역\r\n", ex-> "번역\r\n\r\n")
array[0][n][1] : * 번역 원본, null check, 줄바꿈 포함 (ex-> "xxxx\r\n", ex-> "xxxx\r\n\r\n")

array[1] : 단어 품사, null check
array[1][n] : n:다른 품사들
array[1][n][0] : * 품사
array[1][n][1][n] : * 의미들

array[2] : 언어 code (ex-> "en")

array[5] : 다른 의미, 줄바꿈, null check
array[5][n] : n:단어, 짧은 문장 단위
array[5][n][0] : * 번역 원본 or 줄바꿈만 (ex-> "\r\n", ex-> "\r\n\r\n")
array[5][n][2][n] : n:다른 의미들
array[5][n][2][n][0] : * 번역

*/


/* eslint-enable */
/* eslint-disable no-unused-vars */

const requestHeader = ['Content-Type', 'application/x-www-form-urlencoded;charset=utf-8']

function getTkk () {
	return eu
}
function setTkk (value) {
	eu = value
}

function getTk (value) {
	return fu(value)
}
