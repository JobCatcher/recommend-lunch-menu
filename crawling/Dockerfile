# Python 3.9.1 기반 이미지 사용
FROM python:3.9.1-alpine

# 작업 디렉토리 설정
WORKDIR /app

RUN python3 -m venv venv
RUN source venv/bin/activate

COPY requirements.txt .

# pip 버전 최신화 및 프로젝트 의존성 설치
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

EXPOSE 5000

# 컨테이너 실행 시 실행할 명령어
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]