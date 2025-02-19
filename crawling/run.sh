#!/bin/bash

# 가상환경 생성(맥)
#python3 -m venv venv

# python 가상환경 실행(맥)
#source venv/bin/activate

# 가상환경 생성(윈도우)
python -m venv venv

# python 가상환경 실행(윈도우)
source venv/Scripts/activate

# 프로젝트 의존성 설처
pip install -r requirements.txt

# FastAPI 서버 실행
uvicorn app:app --host 0.0.0.0 --port 5000 --reload

