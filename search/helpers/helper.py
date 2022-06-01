from fastapi.encoders import jsonable_encoder



def format_response(status_code: int, message: str, data_name: str, data, count):
    if data_name == None and data == None:
        return jsonable_encoder({
            'statusCode': status_code,
            'message': message,
        })
    
    return jsonable_encoder({
        'statusCode': status_code,
        'message': message,
        'count': count,
        data_name: data,
    })


def create_jumia_search_url(word: str, price_range: str):
    url = 'https://www.jumia.com.ng/catalog/?q=' + word + '&price=' + price_range.replace(' ', '')

    if price_range == '':
        url = 'https://www.jumia.com.ng/catalog/?q=' + word
    
    return url.replace(' ', '+')
 
def create_konga_search_url(word: str):
    url = 'https://konga.com/search?search=' + word
    return url.replace(' ', '%20')
 


