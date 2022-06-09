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


def create_jumia_search_url(word: str, price_range: str = ''):
    url = 'https://www.jumia.com.ng/catalog/?q=' + word

    if price_range != '':
        min_price, max_price = price_range_format(price_range)
        url += '&price=' + str(min_price) + '-' + str(max_price)

    return url.replace(' ', '+')
 

def create_konga_search_url(word: str, price_range: str = ''):
    url = 'https://konga.com/search?search=' + word

    if price_range != '':
        min_price, max_price = price_range_format(price_range)
        url += '&max=' + str(max_price) + '&min=' + str(min_price)

    return url.replace(' ', '%20')
 

def convert_price_to_float(price: str):
    return float(price.replace('₦', '').replace(' ', '').replace(',', ''))


def get_product_price(price: str):
    product_price = price.split('-')[0]
    return convert_price_to_float(product_price)


def price_range_format(price_range: str = ''):
    try:
        price_list = str(price_range).split('-')
        price = float(price_list[0].replace(' ','').replace(',', '').replace('#', ''))
        price_to = 0

        if len(price_list) == 1 and price:
            return  0, price

        if len(price_list) == 2 and price and price_list[1] == '':
            return 0, price

        else:
            price_to = float(price_list[1].replace(' ','').replace(',', '').replace('#', ''))
            if price > price_to:
                price, price_to = price_to, price
        return price, price_to

    except Exception as e:
        return ''
        pass
    

def filter_by_price_range(products_list, price_range: str):
    try:
        filtered_products_list = []
        price_from, price_to = price_range_format(price_range)

        for product in products_list:
            product_price = get_product_price(product.get('price'))
            if product_price >= price_from and product_price <= price_to:
                filtered_products_list.append(product)
        filtered_products_list.sort(key=lambda x: get_product_price(x.get('price')))
        return filtered_products_list

    except Exception as e:
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





