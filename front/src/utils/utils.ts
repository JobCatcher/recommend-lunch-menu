export const getNumbers = (text: unknown) => {
  if (typeof text === "string") {
    // 정규식을 사용하여 숫자 패턴(쉼표 포함)을 모두 추출
    const numbers = text.match(/\d{1,10}(,\d{10})*(\.\d+)?/g);
    return numbers;
  }
  return "";
};
