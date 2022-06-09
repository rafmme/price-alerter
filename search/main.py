from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from helpers.helper import format_response
from helpers.scraper import get_products, product_info


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)


@app.get('/')
def index():
    return format_response(200, 'Welcome to the Product Search Service!', None, None, None)


@app.get('/search')
def search_for_product(word: str, price_range: str = ''):
    try:
        result = get_products(word, price_range)
        return format_response(200, 'Search Results for product `' + word + '`', 'products', result, len(result))

    except Exception as e:
        print('::: SEARCH ERR :::', e)
        return format_response(500, 'An error occured on the server', 'products', [], 0)
        pass


@app.get('/info')
def get_product_info(tag: str):
    try:
        result = product_info(tag)
        return format_response(200, 'Product Info', 'product', result, None)

    except Exception as e:
        print('::: ITEM_INFO ERR :::', e)
        return format_response(500, 'An error occured on the server', 'product', {}, None)
        pass

