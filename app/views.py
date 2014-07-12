from index import app
from flask import render_template, request
from config import BASE_URL


@app.route('/')
def index():
    page_url = BASE_URL + request.path
    page_title = 'Lyme Disease In The Northeast'

    social = {
        'title': "",
        'subtitle': "",
        'img': "",
        'description': "",
        'twitter_text': "",
        'twitter_hashtag': ""
    }

    return render_template('content.html',
        page_title=page_title,
        social=social,
        page_url=page_url)


@app.route('/counties')
def counties():
    return render_template('counties.html')
