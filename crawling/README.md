# Crawling Project

## 설치 방법

```bash
git clone <repository-url>
cd my_project
python3 -m venv venv

# 가상환경 활성(Mac)
`source venv/bin/activate`

# 가상환경 활성(Window)
.\venv\Scripts\activate

pip install -r requirements.txt
```

## 실행 방법

```
  # Flask에서 FastAPI로 변경에 따른 실행 command 변경
  uvicorn app:app --host 0.0.0.0 --port 5000 --reload
```

### 버그 수정

- dockerfile 실행된 뒤에도 flask 접속 안됬던 문제.
  ![alt text](image.png)
