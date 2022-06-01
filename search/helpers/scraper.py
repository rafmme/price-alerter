import requests, lxml, time
from selenium import webdriver
from bs4 import BeautifulSoup
from models.product import Product
from helpers.helper import create_jumia_search_url, create_konga_search_url




DRIVER_PATH = '/usr/local/bin/chromedriver'
http_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
}

def get_webpage(url: str):
    HTML = requests.get(url, headers = http_headers)
    soup = BeautifulSoup(HTML.text, 'lxml')
    return soup

def scrape_jumia_page(page_url: str):
    count = 0
    products_list = []
    soup = get_webpage(page_url)
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
            url = 'https://www.jumia.com.ng/' + article.find('a', class_ = 'core').attrs['href']
            name = article.find('h3', class_ = 'name').text
            price = article.find('div', class_ = 'prc').text
            image_url = article.find('img', class_ = 'img').attrs['data-src']

            product = Product(name, image_url, url, price).get_product()
            products_list.append(product)
            count += 1

        except KeyError:
            pass
    
    return [products_list, count]
   

def scrape_konga_page(page_url: str):
    count = 0
    products_list = []
    driver = webdriver.Chrome(executable_path=DRIVER_PATH)
    driver.get(page_url)
    time.sleep(8)

    try:
        products_section = driver.find_element_by_id('mainContent')
        products_catalog = products_section.find_elements_by_css_selector('section:nth-of-type(3) > section:nth-of-type(1) > section:nth-of-type(1) > section:nth-of-type(1) > section:nth-of-type(1) > ul:nth-of-type(1) > li')

        for li in products_catalog:
            url = li.find_element_by_css_selector('div > div > div > a').get_attribute('href')
            image_url = li.find_element_by_css_selector('div > div > div:nth-of-type(1) > a:nth-of-type(1) > picture').find_element_by_tag_name('img').get_attribute('data-src')
            name = li.find_element_by_css_selector('div > div > div:nth-of-type(2) > a:nth-of-type(1) > div:nth-of-type(1) > h3').text
            price = li.find_element_by_css_selector('div > div > div:nth-of-type(2) > a:nth-of-type(1) > div:nth-of-type(2) > span').text

            product = Product(name, image_url, url, price).get_product()
            products_list.append(product)
            count += 1
    
    except TypeError:
        driver.quit()
        pass
    driver.quit()

    return [products_list, count]




   
def get_products(word: str, price_range: str):
    jumia_data = scrape_jumia_page(create_jumia_search_url(word, price_range))
    konga_data = scrape_konga_page(create_konga_search_url(word))

    products = konga_data[0] + jumia_data[0]
    products_count = konga_data[1] + jumia_data[1]

    return [products, products_count]





