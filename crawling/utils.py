import re

def extract_numbers(text: str):
    # 숫자에서 컴마(,)를 제거
    text = text.replace(",", "")
    
    # 숫자와 소수점 포함된 형태로 수정된 정규식
    numbers = re.findall(r'\d+\.\d+|\d+', text)  # 소수점이 있는 숫자와 정수 모두 포함

    # 소수점 포함된 숫자와 정수로 분리하여 반환
    result = []
    for number in numbers:
        try:
            # 소수점이 포함된 숫자라면 float로, 아니면 int로 변환
            result.append(float(number) if '.' in number else int(number))
        except ValueError:
            continue  # 변환할 수 없으면 무시
    
    return result if result else None  # 숫자가 없으면 None 반환
