from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import aiohttp
from bs4 import BeautifulSoup
from utils import extract_numbers

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Places API 설정
GOOGLE_API_KEY = ""
GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places:searchNearby"
HEADERS = {
    "X-Goog-Api-Key": GOOGLE_API_KEY,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
    "Accept-Language": "ko"
}

# Google Places API를 이용해 인근 음식점 정보를 가져오는 함수
async def fetch_nearby_restaurants(latitude: float, longitude: float, radius: float = 500, max_results: int = 10):
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
    async with aiohttp.ClientSession() as session:
        async with session.post(GOOGLE_PLACES_URL, json=body, headers=HEADERS) as response:
            if response.status != 200:
                text = await response.text()
                return None, text
            result = await response.json()
            print(result)
            return result.get("places", []), None

# 네이버 검색 결과를 크롤링하는 함수
async def scrape_data(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            html_text = await response.text()
            soup = BeautifulSoup(html_text, 'html.parser')
            answer = []

            # 예시: 평점, 방문자 리뷰, 블로그 리뷰 수 크롤링 (실제 크롤링 로직은 페이지 구조에 따라 수정 필요)
            span_tags = soup.find_all('span', {'class': 'PXMot'})
            if len(span_tags) == 0:
                return {}

            for tag in span_tags:
                # 예시: 특정 클래스가 있으면 평점 정보를 추출
                if 'LXIwF' in tag.get('class', []):
                    print('has rating')
                    answer.append(tag.text)
                else:
                    # 링크 안의 텍스트 추출 (실제 로직은 페이지 구조에 따라 조정)
                    a_tag = tag.find('a')
                    if a_tag:
                        answer.append(a_tag.text)
                    else:
                        answer.append(tag.text)

            if len(answer) == 3:
                star_rating = answer[0]
                visitor_review_count = answer[1]
                blog_review_count = answer[2]
            else:
                star_rating = ""
                visitor_review_count = answer[0] if len(answer) > 0 else ""
                blog_review_count = answer[1] if len(answer) > 1 else ""

            return {
                'starRating': extract_numbers(star_rating),
                'visitorReviewCount': extract_numbers(visitor_review_count),
                'blogReviewCount': extract_numbers(blog_review_count)
            }

def get_queryUrl(query: str) -> str:
    return f'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query={query}'

# FastAPI 엔드포인트 정의
@app.get("/api/restaurants/search")
async def get_restaurants(latitude: float = Query(...), longitude: float = Query(...), radius: float = Query(500)):
    places, error = await fetch_nearby_restaurants(latitude, longitude, radius)
    if error:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {error}")

    enriched_data = []
    for place in places:
        name = place.get("displayName", {}).get("text", "Unknown")
        googleId = place.get('id',"Unknown")
        formatted_address = place.get("formattedAddress", "Unknown")
        location = place.get("location", {})

        # 음식점 주소와 상호명을 결합하여 네이버 검색 URL 생성
        formatted_url = get_queryUrl(formatted_address + " " + name)
        scraped_info = await scrape_data(formatted_url)
        enriched_info = {
            **scraped_info,
            'name': name,
            'address': formatted_address,
            'googleId': googleId,
            'latitude': location.get('latitude', 'N/A'),
            'longitude': location.get('longitude', 'N/A'),
        }
        enriched_data.append(enriched_info)

    return JSONResponse(content=enriched_data, media_type="application/json; charset=utf-8")

@app.get("/")
def read_root():
    return "Hello, FastAPI!"

# Uvicorn을 사용하여 실행 (터미널에서 아래 명령어로 실행: uvicorn app:app --host 0.0.0.0 --port 5000)
