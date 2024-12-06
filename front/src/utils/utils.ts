export const getNumbers = (text: unknown) => {
  if (typeof text === 'string') {
    // 정규식을 사용하여 숫자 패턴(쉼표 포함)을 모두 추출
    const numbers = text.match(/\d{1,10}(,\d{10})*(\.\d+)?/g);
    return numbers;
  }
  return '';
};

export const navigateToRestaurant = async (storeName: string, dongName?: string) => {
  const name = dongName ? `${dongName} ${storeName}` : `수내역 ${storeName}`;

  // window.open(
  //   `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${name}`,
  //   "_blank"
  // );
  window.open(`https://map.naver.com/v5/search/${name}`, '_blank');
};

export const getDongName = async (longitude: number, latitude: number) => {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_REST_API_KEY}`,
      },
    },
  );

  const data = await response.json();

  const {address_name, region_2depth_name, region_3depth_name} = data.documents[0];

  if (data?.documents?.[0].region_3depth_name.endsWith('동')) {
    return `${region_2depth_name} ${region_3depth_name}`;
  }
  return address_name;
};

export const isMobile = () => {
  let isMobile = navigator.userAgentData?.mobile;

  return !!isMobile;
};

export const setActiveMarker = (map: any, activeMarkerAtom: any, latitude: number, longitude: number) => {
  if (activeMarkerAtom) {
    activeMarkerAtom.setMap(null);
  }

  const imageSrc = '/active.png';
  const imageSize = new window.kakao.maps.Size(28, 38);
  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

  let marker = new window.kakao.maps.Marker({
    map: map!,
    position: new window.kakao.maps.LatLng(latitude, longitude),
    image: markerImage,
  });

  marker.setMap(map);
  return marker;
};
