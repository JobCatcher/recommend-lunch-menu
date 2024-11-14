from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# 크롤링 함수: 필요한 URL에서 데이터를 추출
def scrape_data(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    star_rating = 0
    answer = []

    # 예시: 평점, 이미지, 리뷰수 데이터를 크롤링
    # image_url = soup.find('div', {'class': 'claas'})['src']  # 필요에 맞게 수정
    span_tags = soup.find_all('span', {'class': 'PXMot'})
    if (len(span_tags) == 0): return

    for tag in span_tags:
        if 'LXIwF' in tag.get('class', []):
            print('has rating')
            # star_rating = tag.text
            answer.append(tag.text)
            continue
    
        answer.append(tag.find('a').text)  # 필요에 맞게 수정

    if (len(answer) == 3): 
        star_rating = answer[0]
        visitor_review_count = answer[1]
        blog_review_count = answer[2]
    else :
        visitor_review_count = answer[0]
        blog_review_count = answer[1]

    return {
        '별점': star_rating,
        # 'image_url': image_url,
        '방문자리뷰': visitor_review_count,
        '블로그리뷰': blog_review_count
    }

# API 엔드포인트
@app.route('/', methods=['GET'])
def hello_world():
    return "Hello, World!"

@app.route('/api/scrape', methods=['GET'])
def get_scraped_data():
    query = request.args.get('query')
    url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query='+query+'' # 크롤링할 URL
    data = scrape_data(url)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
