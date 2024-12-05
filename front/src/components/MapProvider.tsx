import {useEffect, useState} from 'react';
import Data from '../../data/data.json';
import ReactDOMServer from 'react-dom/server';
import {getDongName, navigateToRestaurant} from '../utils/utils';
import Restaurant from './Restaurant';
import {KakaoInfoWindow, KakaoMap, KakaoMarker, KakaoNamespace} from '../types/kakao';
import {RestaurantInfo} from '../types/restaurant';
import {getDefaultStore, useAtom} from 'jotai';
import {clickedRestaurantAtom, restaurantsAtom} from '../stores/restaurantAtom';
import {infoWindowAtom, mapAtom} from '../stores/mapAtom';

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

const MapProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  // 서울 중심 좌표
  const [coordinates, setCoordinates] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  });

  let dongName = '';
  const mapKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const [, setMapAtom] = useAtom(mapAtom);
  const [, setRestaurantsAtom] = useAtom(restaurantsAtom);

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  const clickListener = (map: KakaoMap, marker: KakaoMarker, infowindow: KakaoInfoWindow, id: number) => {
    return () => {
      const infoWindowStore = getDefaultStore();
      const activeInfoWindowAtom = infoWindowStore.get(infoWindowAtom);

      if (activeInfoWindowAtom !== infowindow) {
        activeInfoWindowAtom?.close();
        infoWindowStore.set(infoWindowAtom, infowindow);
        return infowindow.open(map, marker);
      }
    };
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async position => {
      const {latitude, longitude} = position.coords;
      setCoordinates({latitude, longitude});

      try {
        const data = await getDongName(longitude, latitude);
        dongName = data;

        // const fetchRestaurants = await fetch(
        //   // `http://192.168.166.48:8080/restaurants/search?latitude=37.37836077986753&longitude=127.1141486781632`
        //   `http://192.168.166.48:8080/restaurants/search?latitude=${latitude}&longitude=${longitude}`,
        //   // `http://192.168.166.48:8080/restaurants/all`,
        // ).then(res => res.json());

        setRestaurants(Data.meal);
        setRestaurantsAtom({restaurants: Data.meal});
        // setRestaurants(fetchRestaurants);
        // setRestaurantsAtom({restaurants: fetchRestaurants});
      } catch (error) {
        console.error('Error On KAKAO API(GET Dong Name):', error);
      }
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapKey}&autoload=false`;
    script.async = true;

    const {latitude, longitude} = coordinates;

    if (!latitude && !longitude) {
      throw new Error('위치 정보를 받아오지 못하였습니다.');
    }

    script.onload = () => {
      // Kakao Maps SDK 로드 후 초기화
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3, // 지도 확대 레벨
        };

        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options);
        let restaurantMarker: KakaoMarker;

        // 음식점 마커 생성 및 표시
        for (let i = 0; i < restaurants?.length; i++) {
          const latlng = new window.kakao.maps.LatLng(restaurants?.[i].latitude, restaurants?.[i].longitude);
          const imageSize = new window.kakao.maps.Size(24, 35);

          // 마커 이미지를 생성합니다
          const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

          // 마커를 생성합니다
          restaurantMarker = new window.kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: latlng, // 마커를 표시할 위치
            image: markerImage, // 마커 이미지
            clickable: true,
          });

          // 마커에 표시할 인포윈도우를 생성합니다
          const infowindow = new window.kakao.maps.InfoWindow({
            position: latlng,
            content: `${ReactDOMServer.renderToString(<Restaurant {...restaurants?.[i]} />)}`,
            removable: true,
          });

          window.kakao.maps.event.addListener(
            restaurantMarker,
            'click',
            clickListener(map, restaurantMarker, infowindow, restaurants?.[i].id),
          );
        }

        // 지도에 마커 추가 (옵션)
        const currentPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const currentPositionMarker = new window.kakao.maps.Marker({
          position: currentPosition,
        });

        currentPositionMarker.setMap(map);
        setMapAtom(map);
      });
    };

    document.head.appendChild(script);
    setIsLoading(false);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, [coordinates, restaurants, mapKey]);

  return <>{isLoading ? <>loading...</> : children}</>;
  // return <>{children}</>;
};

export default MapProvider;
