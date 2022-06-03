from fastapi import FastAPI
from helpers.helper import format_response
from helpers.scraper import get_products


app = FastAPI()


@app.get('/')
def index():
    return format_response(200, 'Welcome to the Product Search Service!', None, None, None)



@app.get('/search')
def search_for_product(word: str, price_range: str = ''):
    try:
        result = get_products(word, price_range)
        return format_response(200, 'Search Results for product `' + word + '`', 'products', result, len(result))

    except Exception as e:
        return format_response(500, 'An error occured on the server', 'products', [], 0)
        pass


