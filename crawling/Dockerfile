# Python 3.9.1 기반 이미지 사용
FROM python:3.9.1-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일 복사
COPY requirements.txt .

# 의존성 설치 (캐시 최소화)
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

EXPOSE 5000

# 컨테이너 실행 시 실행할 명령어
CMD ["python", "app.py"]