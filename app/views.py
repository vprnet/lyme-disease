from index import app
from flask import render_template, request
from config import BASE_URL


@app.route('/')
def index():
    page_url = BASE_URL + request.path
    page_title = "Lyme Disease's Front Line: Vermont"

    social = {
        'title': "Lyme Disease Cases Are Increasing Faster In Vermont Than Anywhere In The Country",
        'subtitle': "",
        'img': "",
        'description': "",
        'twitter_text': "Fifty years ago this disease didn't have a name, now it's advancing up the North Country",
        'twitter_hashtag': ""
    }

    return render_template('content.html',
        page_title=page_title,
        social=social,
        page_url=page_url)


@app.route('/us-counties')
def us_counties():
    return render_template('us-counties.html')


@app.route('/vt-counties')
def vt_counties():
    return render_template('vt-counties.html')


@app.route('/northeast')
def northeast():
    page_url = BASE_URL + request.path
    page_title = 'Lyme Disease Cases Are Increasing Faster In Vermont Than Anywhere In The Country'

    social = {
        'title': "Lyme Disease Cases Are Increasing Faster In Vermont Than Anywhere In The Country",
        'subtitle': "",
        'img': "",
        'description': "",
        'twitter_text': "Fifty years ago this disease didn't have a name, now it's advancing up the North Country",
        'twitter_hashtag': ""
    }
    return render_template('northeast.html',
        page_title=page_title,
        social=social,
        page_url=page_url)
