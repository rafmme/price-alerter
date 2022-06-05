from fastapi.encoders import jsonable_encoder
from datetime import datetime


def format_response(status_code: int, message: str, data_name: str, data, count):
    current_date = datetime.now().strftime("%d %B, %Y | %I:%M:%S %p")

    if data_name == None and data == None:
        return jsonable_encoder({
            'statusCode': status_code,
            'message': message,
        })
    
    return jsonable_encoder({
        'statusCode': status_code,
        'message': message,
        'time': current_date + ' GMT',
        'count': count,
        data_name: data,
    })


def create_jumia_search_url(word: str):
    url = 'https://www.jumia.com.ng/catalog/?q=' + word
    return url.replace(' ', '+')
 

def create_konga_search_url(word: str):
    url = 'https://konga.com/search?search=' + word
    return url.replace(' ', '%20')
 

def convert_price_to_float(price: str):
    return float(price.replace('₦', '').replace(' ', '').replace(',', ''))


def get_product_price(price: str):
    product_price = price.split('-')[0]
    return convert_price_to_float(product_price)


def filter_by_price_range(products_list, price_range: str):
    try:
        filtered_products_list = []
        price_from = 0
        price_to = 0
        price_list = price_range.split('-')
        price = float(price_list[0].replace(' ','').replace(',', '').replace('#', ''))

        if len(price_list) == 1 and price:
            price_to = price
        else:
            price_from = price
            price_to = float(price_list[1].replace(' ','').replace(',', '').replace('#', ''))

            if price_from > price_to:
                price_from, price_to = price_to, price_from

        for product in products_list:
            product_price = get_product_price(product.get('price'))

            if product_price >= price_from and product_price <= price_to:
                filtered_products_list.append(product)
        
        return filtered_products_list
            
    except ValueError:
        return products_list
        pass


def create_product_tag(url: str):
    link = url.replace('https://www.konga.com', '').replace('https://www.jumia.com.ng', '')
    tag = link.replace('-', '_').replace('.', '__').replace('/', '___').replace('___', '/', 1)
    return tag


def tag_to_url(tag: str):
    url = ''
    if tag.startswith('/product___'):
        url = 'https://www.konga.com' + tag.replace('___', '/').replace('__', '.').replace('_', '-')
    else:
        url = 'https://www.jumia.com.ng' + tag.replace('___', '/').replace('__', '.').replace('_', '-')
    return url





