from fastapi import FastAPI
from helpers.helper import format_response


app = FastAPI()


@app.get('/')
def index():
    return format_response(200, 'Welcome to the Product Search Service!', None, None)