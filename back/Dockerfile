# Java 21 JDK 이미지 사용
FROM --platform=linux/amd64 openjdk:21-jdk-slim

# 애플리케이션 JAR 파일을 컨테이너로 복사
COPY build/libs/restaurant-0.0.1-SNAPSHOT.jar /app.jar

# 컨테이너 시작 시 실행할 명령어
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "/app.jar"]