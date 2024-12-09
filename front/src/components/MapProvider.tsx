import {useEffect, useState} from 'react';
import Data from '../../data/data.json';
import ReactDOMServer from 'react-dom/server';
import {getDongName, setActiveMarker} from '../utils/utils';
import Restaurant from './Restaurant';
import {KakaoInfoWindow, KakaoMap, KakaoMarker, KakaoNamespace} from '../types/kakao';
import {RestaurantInfo} from '../types/restaurant';
import {getDefaultStore, useAtom} from 'jotai';
import {clickedRestaurantAtom, restaurantsAtom} from '../stores/restaurantAtom';
import {infoWindowAtom, mapAtom, markerAtom} from '../stores/mapAtom';

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

const MapProvider = ({children}: {children: React.ReactNode}) => {
  let map: KakaoMap;
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

  // 인포윈도우 내 닫기 버튼 클릭 시 인포윈도우 닫히는 이벤트
  const closeInfoWindow = (activeMarker: KakaoMarker) => {
    const closeButton = document.querySelector('[alt="close"]');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        activeMarker.setMap(null);
      });
    }
  };

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  const clickListener = (
    map: KakaoMap,
    marker: KakaoMarker,
    infowindow: KakaoInfoWindow,
    restaurant: RestaurantInfo,
  ) => {
    return () => {
      const {latitude, longitude, id} = restaurant;
      const store = getDefaultStore();
      const activeInfoWindowAtom = store.get(infoWindowAtom);
      const activeMarkerAtom = store.get(markerAtom);

      if (activeInfoWindowAtom !== infowindow) {
        activeInfoWindowAtom?.close();
        activeMarkerAtom?.setMap(null);

        const activeMarker = setActiveMarker(map, activeMarkerAtom, latitude, longitude);

        store.set(infoWindowAtom, infowindow);
        store.set(markerAtom, activeMarker);
        infowindow.open(map, marker);
        closeInfoWindow(activeMarker);
        return;
      }
    };
  };

  const tempHandler = function () {
    alert('center changed!');
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async position => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
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
        map = new window.kakao.maps.Map(container, options);
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
            clickListener(map, restaurantMarker, infowindow, restaurants?.[i]),
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

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, [coordinates, restaurants, mapKey]);

  return <>{isLoading ? <>loading...</> : children}</>;
};

export default MapProvider;
