export const getNumbers = (text: unknown) => {
  if (typeof text === "string") {
    // 정규식을 사용하여 숫자 패턴(쉼표 포함)을 모두 추출
    const numbers = text.match(/\d{1,10}(,\d{10})*(\.\d+)?/g);
    return numbers;
  }
  return "";
};

export const handleClickRestaurant = async (storeName: string) => {
  const name = !storeName.includes("수내") ? `수내역 ${storeName}` : storeName;

  window.open(
    `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${name}`,
    "_blank"
  );
  // window.open(`https://map.naver.com/v5/search/${name}`, "_blank");
  // console.log("dda: ", `http://localhost:5000/api/scrape?query=${name}`);
};
