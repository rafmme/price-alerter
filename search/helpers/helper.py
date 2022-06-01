from fastapi.encoders import jsonable_encoder

def format_response(status_code: int, message: str, data_name: str, data):
    if data_name == None and data == None:
        return jsonable_encoder({
            'statusCode': status_code,
            'message': message,
        })
    
    return jsonable_encoder({
        'statusCode': status_code,
        'message': message,
        data_name: data,
    })