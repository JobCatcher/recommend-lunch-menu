import {KakaoMap, KakaoMarker} from '../types/kakao';

/**
 * 1 - km
 * 1000 - m
 */
const DISTANCE = 1000;

export const getNumbers = (text: unknown) => {
  if (typeof text === 'string') {
    // 정규식을 사용하여 숫자 패턴(쉼표 포함)을 모두 추출
    const numbers = text.match(/\d{1,10}(,\d{10})*(\.\d+)?/g);
    return numbers;
  }
  return '';
};

export const navigateToRestaurant = (storeName: string, dongName?: string) => {
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
  const isMobile = navigator.userAgentData?.mobile;

  return !!isMobile;
};

export const setActiveMarker = (map: KakaoMap, activeMarkerAtom: KakaoMarker, latitude: number, longitude: number) => {
  if (activeMarkerAtom) {
    activeMarkerAtom.setMap(null);
  }

  const imageSrc = '/active.png';
  const imageSize = new window.kakao.maps.Size(28, 38);
  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

  const marker = new window.kakao.maps.Marker({
    map: map!,
    position: new window.kakao.maps.LatLng(latitude, longitude),
    image: markerImage,
  });

  marker.setMap(map);
  return marker;
};

export const triggerEvent = (type: 'click', object: unknown) => {
  if (type === 'click') {
    if (object instanceof window.kakao.maps.Marker) {
      window.kakao.maps.event.trigger(object, 'click');
    }
  }
};

export const getDistanceFromLatLonInKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  //lat1:위도1, lng1:경도1, lat2:위도2, lat2:경도2
  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
  const R = 6371 * DISTANCE; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d.toFixed(2);
};
