import requests, lxml, time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from models.product import Product
from helpers.helper import create_jumia_search_url, create_konga_search_url, filter_by_price_range, create_product_tag, tag_to_url
from helpers.custom_thread import ThreadWithResult



http_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
}

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--window-size=1920,1200")
options.add_argument("--disable-dev-shm-usage")


def get_webpage(url: str):
    HTML = requests.get(url, headers=http_headers)
    soup = BeautifulSoup(HTML.text, 'lxml')
    return soup


def scrape_jumia_page(page_url: str, is_info: bool = False):
    products_list = []
    soup = get_webpage(page_url)

    if is_info:
        p_url = page_url
        p_name = soup.select('#jm > main > div:nth-child(1) > section > div > div.col10')[0].find('h1').text
        p_price = ''

        if len(soup.select('#jm > main > div:nth-child(1) > section > div > div.col10 > div:nth-child(2) > div:nth-child(2) > div > span')) >= 1:
            p_price = soup.select('#jm > main > div:nth-child(1) > section > div > div.col10 > div:nth-child(2) > div:nth-child(2) > div > span')[0].text

        elif len(soup.select('#jm > main > div:nth-child(1) > section > div > div.col10 > div:nth-child(2) > div:nth-child(3) > div > span')) >= 1:
            p_price = soup.select('#jm > main > div:nth-child(1) > section > div > div.col10 > div:nth-child(2) > div:nth-child(3) > div > span')[0].text
        
        img_url = soup.select('#imgs > a:nth-of-type(1)')[0].attrs['href']
        p_info = soup.select('#jm > main > div:nth-child(2) > div.col12 > div > div.markup')[0].text

        return {
            'name': p_name,
            'price': p_price,
            'url': p_url,
            'info': p_info,
            'imageUrl': img_url
        }


    soup2 = get_webpage(page_url + '&page=2#catalog-listing')
    soup3 = get_webpage(page_url + '&page=3#catalog-listing')
    soup4 = get_webpage(page_url + '&page=4#catalog-listing')
    soup5 = get_webpage(page_url + '&page=4#catalog-listing')
    products_catalog = []
    
    if soup.find('section', class_ = '-fh') != None and soup.find('section', class_ = '-fh').find('div', class_ = 'row') != None and soup.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article') != None:
        products_catalog +=  soup.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article')

    if soup2.find('section', class_ = '-fh') != None and soup2.find('section', class_ = '-fh').find('div', class_ = 'row') != None and soup2.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article') != None:
        products_catalog +=  soup2.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article')

    if soup3.find('section', class_ = '-fh') != None and soup3.find('section', class_ = '-fh').find('div', class_ = 'row') != None and soup3.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article') != None:
        products_catalog +=  soup3.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article')

    if soup4.find('section', class_ = '-fh') != None and soup4.find('section', class_ = '-fh').find('div', class_ = 'row') != None and soup4.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article') != None:
        products_catalog +=  soup4.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article')

    if soup5.find('section', class_ = '-fh') != None and soup5.find('section', class_ = '-fh').find('div', class_ = 'row') != None and soup5.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article') != None:
        products_catalog +=  soup5.find('section', class_ = '-fh').find('div', class_ = 'row').find_all('article')

    for article in products_catalog:
        try:
            url = 'https://www.jumia.com.ng' + article.find('a', class_ = 'core').attrs['href']
            name = article.find('h3', class_ = 'name').text
            price = article.find('div', class_ = 'prc').text
            image_url = article.find('img', class_ = 'img').attrs['data-src']
            tag = create_product_tag(url)

            product = Product(name, image_url, url, price, tag).get_product()
            products_list.append(product)

        except KeyError:
            return products_list
            pass
    
    return products_list
   

def scrape_konga_page(page_url: str, is_info: bool = False):
    products_list = []
    driver = webdriver.Chrome(options=options)
    driver.get(page_url)

    try:
        if is_info:
            p_url = page_url
            p_name = driver.find_element_by_css_selector('#mainContent > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > h4').text
            p_price = driver.find_element_by_css_selector('#mainContent > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > form > div:nth-of-type(3) > div:nth-of-type(1) > div').text
            img_url = driver.find_element_by_css_selector('#mainContent > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div > div > div > div:nth-of-type(1) > picture > img').get_attribute('src')
            p_info = driver.find_element_by_css_selector('#productDetailSection > div > div:nth-of-type(1) > div:nth-of-type(2) > div > div > p:nth-of-type(1)').text

            return {
                'name': p_name,
                'price': p_price,
                'url': p_url,
                'info': p_info,
                'imageUrl': img_url
            }

        
        products_section = WebDriverWait(driver, timeout=5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '#mainContent > section:nth-of-type(3) > section:nth-of-type(1) > section:nth-of-type(1) > section:nth-of-type(1) > section:nth-of-type(1) > ul:nth-of-type(1)'))
        )
        products_catalog = products_section.find_elements_by_css_selector('li')
        
        for li in products_catalog:
            url = li.find_element_by_css_selector('div > div > div > a').get_attribute('href')
            image_url = li.find_element_by_css_selector('div > div > div:nth-of-type(1) > a:nth-of-type(1) > picture').find_element_by_tag_name('img').get_attribute('data-src')
            name = li.find_element_by_css_selector('div > div > div:nth-of-type(2) > a:nth-of-type(1) > div:nth-of-type(1) > h3').text
            price = li.find_element_by_css_selector('div > div > div:nth-of-type(2) > a:nth-of-type(1) > div:nth-of-type(2) > span').text
            tag = create_product_tag(url)

            product = Product(name, image_url, url, price, tag).get_product()
            products_list.append(product)
    
    except Exception as e:
        driver.quit()
        if is_info:
            return {}
        return products_list
        pass

    driver.quit()
    return products_list

   
def get_products(word: str, price_range: str):
    jumia_search_url = create_jumia_search_url(word, price_range)
    #konga_search_url= create_konga_search_url(word, price_range)
    jumia_thread = ThreadWithResult(target=scrape_jumia_page, args=(jumia_search_url, ))
    #konga_thread = ThreadWithResult(target=scrape_konga_page, args=(konga_search_url, ))

    jumia_thread.start()
    #konga_thread.start()
    jumia_thread.join()
    #konga_thread.join()
    jumia_data = jumia_thread.result
    #konga_data = konga_thread.result
    

    products = filter_by_price_range(jumia_data, price_range) 

    return products


def product_info(tag: str):
    result = {}
    url = tag_to_url(tag)

    if url.startswith('https://www.konga.com'):
        konga_thread = ThreadWithResult(target=scrape_konga_page, args=(url, True, ))
        konga_thread.start()
        konga_thread.join()
        result = konga_thread.result

    elif url.startswith('https://www.jumia.com.ng'):
        jumia_thread = ThreadWithResult(target=scrape_jumia_page, args=(url, True, ))
        jumia_thread.start()
        jumia_thread.join()
        result = jumia_thread.result

    return result



