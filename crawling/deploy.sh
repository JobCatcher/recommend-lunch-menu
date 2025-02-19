#!/bin/bash

# 변수 설정
IMAGE_NAME="crawling"
CONTAINER_NAME="crawling"
PORT="5000"

echo "🔨 Docker 이미지 빌드 중..."
docker build -t $IMAGE_NAME .

echo "🛑 기존 컨테이너 중지 및 삭제..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

echo "🚀 새 컨테이너 실행..."
docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME

echo "✅ 컨테이너 실행 완료!"
docker ps | grep $CONTAINER_NAME
