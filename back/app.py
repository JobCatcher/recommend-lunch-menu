from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

# 크롤링 함수: 필요한 URL에서 데이터를 추출
def scrape_data(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 예시: 평점, 이미지, 리뷰수 데이터를 크롤링
    # rating = soup.find('span', {'class': 'rating'}).text  # 필요에 맞게 수정
    # image_url = soup.find('div', {'class': 'claas'})['src']  # 필요에 맞게 수정
    span_tags = soup.find_all('span', {'class': 'PXMot'})
    print("span_ "+str(span_tags))
    print(span_tags[0])
    visitor_review_count = span_tags[0].find('a').text  # 필요에 맞게 수정
    blog_review_count = span_tags[1].find('a').text  # 필요에 맞게 수정
    
    return {
        # 'rating': rating,
        # 'image_url': image_url,
        'visitor_review_count': visitor_review_count,
        'blog_review_count': blog_review_count
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
