from flask import Flask, request, jsonify, Response, current_app
from flask_cors import CORS
import json
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:8080"]}})

@app.route('/', methods=['GET'])
def hello_world():
    return "Hello, World!"

# Google Places API 설정
GOOGLE_API_KEY = "API_KEY"
GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places:searchNearby"
HEADERS = {
    "X-Goog-Api-Key": GOOGLE_API_KEY,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
    "Accept-Language": "ko"
}

# Google Places API를 이용해 인근 음식점 정보를 가져옴
def fetch_nearby_restaurants(latitude, longitude, radius=500, max_results=10):
    body = {
        "includedTypes": ["restaurant"],
        "maxResultCount": max_results,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": latitude, "longitude": longitude},
                "radius": radius
            }
        }
    }
    response = requests.post(GOOGLE_PLACES_URL, json=body, headers=HEADERS)
    if response.status_code != 200:
        return None, response.text
    return response.json().get("places", []), None

# # 네이버 검색을 통해 음식점 리뷰 및 평점 크롤링
# def scrape_data(query):
#     url = f'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query={query}'
#     response = requests.get(url)
#     soup = BeautifulSoup(response.text, 'html.parser')
    
#     result = {"이름": query, "별점": "N/A", "방문자리뷰": "N/A", "블로그리뷰": "N/A"}
#     span_tags = soup.find_all('span', {'class': 'PXMot'})
    
#     if len(span_tags) == 3:
#         result["별점"] = span_tags[0].text
#         result["방문자리뷰"] = span_tags[1].text
#         result["블로그리뷰"] = span_tags[2].text
#     elif len(span_tags) == 2:
#         result["방문자리뷰"] = span_tags[0].text
#         result["블로그리뷰"] = span_tags[1].text
    
#     return result


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

def get_scraped_data():
    query = request.args.get('query')
    url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query='+query+'' # 크롤링할 URL
    data = scrape_data(url)
    return jsonify(data)

@app.route("/api/restaurants/search", methods=["GET"])
def get_restaurants():
    latitude = request.args.get("latitude", type=float)
    longitude = request.args.get("longitude", type=float)
    radius = request.args.get("radius", 500, type=float)
    
    if latitude is None or longitude is None:
        return jsonify({"error": "latitude and longitude are required"}), 400
    
    places, error = fetch_nearby_restaurants(latitude, longitude, radius)
    if error:
        return jsonify({"error": "Failed to fetch data", "details": error}), 500
    # return Response(json.dumps(places, ensure_ascii=False), content_type="application/json; charset=utf-8")
    
    enriched_data = []
    for place in places:
        name = place.get("displayName", {}).get("text", "Unknown")
        formatted_address = place.get("formattedAddress", "Unknown")
        location = place.get("location", {})
        
        scraped_info = scrape_data(name)    # 음식점 이름을 통해 평점, 리뷰수 등 크롤링
        scraped_info["address"] = formatted_address
        scraped_info["googleId"] = location.get("id", "N/A")
        scraped_info["title"] = location.get("title", "N/A")
        scraped_info["latitude"] = location.get("latitude", "N/A")
        scraped_info["longitude"] = location.get("longitude", "N/A")
        
        enriched_data.append(scraped_info)
    
    return Response(json.dumps(enriched_data, ensure_ascii=False), content_type="application/json; charset=utf-8")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
