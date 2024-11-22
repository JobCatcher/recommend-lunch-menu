export const getNumbers = (text: unknown) => {
  if (typeof text === "string") {
    // 정규식을 사용하여 숫자 패턴(쉼표 포함)을 모두 추출
    const numbers = text.match(/\d{1,10}(,\d{10})*(\.\d+)?/g);
    return numbers;
  }
  return "";
};

export const handleClickRestaurant = async (
  storeName: string,
  dongName?: string
) => {
  const name = dongName ? `${dongName} ${storeName}` : `수내역 ${storeName}`;

  // window.open(
  //   `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${name}`,
  //   "_blank"
  // );
  window.open(`https://map.naver.com/v5/search/${name}`, "_blank");
};

export const getDongName = async (longitude: number, latitude: number) => {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_REST_API_KEY}`,
      },
    }
  );

  const data = await response.json();

  const { address_name, region_2depth_name, region_3depth_name } =
    data.documents[0];

  if (data?.documents?.[0].region_3depth_name.endsWith("동")) {
    return `${region_2depth_name} ${region_3depth_name}`;
  }
  return address_name;
};
