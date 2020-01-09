from flask import Flask, jsonify, request
from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support import expected_conditions as expected
from selenium.webdriver.support.wait import WebDriverWait
from bs4 import BeautifulSoup
import soupsieve as sv
import os

class webDriverFirefox():

	driver = None
	wait = None
	url = None
	browserRunning = False

	def __init__(self, url):
		self.url = url

	def driverRun(self): # 브라우저 실행
		try:
			os.remove('./geckodriver.log')
		except:
			pass
		if(not(self.browserRunning)):
			options = Options()
			options.add_argument('-headless')
			self.driver = Firefox(executable_path='./geckodriver', options=options)
			self.wait = WebDriverWait(self.driver, timeout=10)
			self.driver.get(self.url)
			self.browserRunning = True
		return 'online'

	def driverQuit(self): # 브라우저 종료
		if(self.browserRunning):
			self.driver.quit()
			self.browserRunning = False
		return 'offline'

	def driverControl(self, url):
		driver = self.driver
		wait = self.wait
		# wait = WebDriverWait(driver, timeout=10)
		driver.get(url)
		# wait.until(expected.visibility_of_element_located((By.NAME, 'q'))).send_keys('headless firefox' + Keys.ENTER)
		# wait.until(expected.visibility_of_element_located((By.CSS_SELECTOR, '#ires a'))).click()
		# print(driver.page_source)

	def googleTranslate(self, translateString): # 구글번역
		driver = self.driver
		wait = self.wait
		driver.find_element_by_css_selector('textarea#source.orig.tlid-source-text-input.goog-textarea').clear()
		wait.until(expected.invisibility_of_element_located((By.CSS_SELECTOR, 'span.tlid-translation.translation')))
		# driver.get('https://translate.google.com/#auto|ko|{}'.format(translateString))
		driver.find_element_by_css_selector('textarea#source.orig.tlid-source-text-input.goog-textarea').send_keys(translateString)
		try:
			wait.until(expected.visibility_of_element_located((By.CSS_SELECTOR, 'span.tlid-translation.translation')))
		except:
			html = driver.page_source
			driver.find_element_by_css_selector('textarea#source.orig.tlid-source-text-input.goog-textarea').clear()
			if(sv.select_one('div.result-error', BeautifulSoup(html, 'html.parser'))):
				return {"data1": sv.select_one('span.tlid-result-error', BeautifulSoup(html, 'html.parser')).text}
		html = driver.page_source
		driver.find_element_by_css_selector('textarea#source.orig.tlid-source-text-input.goog-textarea').clear()
		# driver.implicitly_wait(5)

		select1 = str(sv.select_one('div.homepage-content-wrap', BeautifulSoup(html, 'html.parser'))) # 번역창 분리

		# data1
		resultString1 = ''
		select4 = sv.select_one('span.tlid-translation.translation', BeautifulSoup(select1, 'html.parser'))
		resultString1 = str(select4).replace('<br/>', '<span>\n</span>')
		resultString1 = BeautifulSoup(resultString1, 'html.parser').text
		# print(resultString1)

		# data2
		resultString2 = ''
		if('<div class="gt-cd gt-cd-mbd gt-cd-baf" style="display: none;"' in select1):
			pass
		elif('<div class="gt-cd gt-cd-mbd gt-cd-baf" style=""' in select1):
			select2 = str(sv.select_one('table.gt-baf-table', BeautifulSoup(select1, 'html.parser')))
			select3 = sv.select('span.gt-cd-pos, span.gt-baf-cell.gt-baf-word-clickable', BeautifulSoup(select2, 'html.parser'))
			for data in select3:
				strData = str(data)
				if('gt-baf-cell' in strData):
					resultString2 += "{}, ".format(data.text)
				elif('gt-cd-pos' in strData):
					resultString2 = resultString2.rstrip(", ")
					resultString2 += "\n* {} *\n: ".format(data.text)
			resultString2 = resultString2.lstrip("\n")
			resultString2 = resultString2.rstrip(", ")
		# print(resultString2)

		return {"data1": resultString1, "data2": resultString2}

app = Flask(__name__)

@app.route("/")
def index():
	return 'hello world'

@app.route("/googletranslate", methods=['POST']) # 구글 번역
def googleTranslate():
	data = request.form['data']
	# print(data)
	resultData = webDriver1.googleTranslate(data)
	return jsonify(resultData)

@app.route("/s") # 브라우저 실행
def driverStart():
	return webDriver1.driverRun()

@app.route("/r") # 브라우저 리부트
def driverRestart():
	if(webDriver1.browserRunning):
		webDriver1.driverQuit()
		return webDriver1.driverRun()
	return webDriver1.driverQuit()

@app.route("/q") # 브라우저 종료
def driverQuit():
	return webDriver1.driverQuit()

if __name__ == '__main__':
	webDriver1 = webDriverFirefox('https://translate.google.co.kr/#auto|ko')
	webDriver1.driverRun()
	app.run(host='0.0.0.0')
	# app.run(host='0.0.0.0', port=5000)
	# app.run(debug=True)
