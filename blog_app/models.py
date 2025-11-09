from beanie import Document
import datetime

class Blog(Document):
    image_url:str
    author : str
    topic:str
    content:str
    likes : int
    date_of_upload:datetime.datetime

    class Settings:
        name = "blogs"