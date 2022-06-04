class Product:
    def __init__(self, name: str, image_url: str, url: str, price: str, tag: str):
        self.name = name
        self.image_url = image_url
        self.price = price
        self.url = url
        self.tag = tag

    def get_product(self):
        return {
            'name': self.name,
            'imageUrl': self.image_url,
            'price': self.price,
            'url': self.url,
            'tag': self.tag
        }






