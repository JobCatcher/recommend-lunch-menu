import {useEffect, useState} from 'react';
import Data from '../../data/data.json';
import ReactDOMServer from 'react-dom/server';
import {getDongName, navigateToRestaurant} from '../utils/utils';
import Restaurant from './Restaurant';
import {KakaoInfoWindow, KakaoMap, KakaoMarker, KakaoNamespace} from '../types/kakao';
import {RestaurantInfo} from '../types/restaurant';
import {getDefaultStore, useAtom} from 'jotai';
import {clickedRestaurantAtom, restaurantsAtom} from '../stores/restaurantAtom';
import {mapAtom} from '../stores/mapAtom';

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

const MapProvider = ({children}: {children: React.ReactNode}) => {
  // 서울 중심 좌표
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  const [coordinates, setCoordinates] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  });

  let dongName = '';
  const mapKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const [, setMapAtom] = useAtom(mapAtom);
  const [, setRestaurantsAtom] = useAtom(restaurantsAtom);

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  const makeOverListener = (map: KakaoMap, marker: KakaoMarker, infowindow: KakaoInfoWindow) => {
    return function () {
      infowindow.open(map, marker);
    };
  };

  // 인포윈도우를 닫는 클로저를 만드는 함수입니다
  const makeOutListener = (infowindow: KakaoInfoWindow) => {
    return function () {
      infowindow.close();
    };
  };

  const navigateTo = (map: KakaoMap, restaurant: RestaurantInfo, dongName: string) => {
    const {id, title, latitude, longitude} = restaurant;
    // closure 환경으로 함수 내부에서 active한 변수 참조
    const restaurantStore = getDefaultStore();
    const {activeRestaurantId} = restaurantStore.get(clickedRestaurantAtom);

    console.log(typeof activeRestaurantId, typeof id, activeRestaurantId, id);

    if (activeRestaurantId !== id) {
      map.panTo(new window.kakao.maps.LatLng(latitude, longitude));
      // const content = ReactDOMServer.renderToString(
      //   <Restaurant restaurant={restaurant} />
      // );
      // const customOverlay = new window.kakao.maps.CustomOverlay({
      //   position: new window.kakao.maps.LatLng(latitude, longitude),
      //   content: content,
      //   xAnchor: 0.6,
      //   yAnchor: 0.91,
      // });
      // customOverlay.setMap(map);
      restaurantStore.set(clickedRestaurantAtom, {activeRestaurantId: id});
      return () => {};
    }

    return () => navigateToRestaurant(title, dongName || '');
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
        //   `http://192.168.166.48:8080/restaurants/search?latitude=${latitude}&longitude=${longitude}`
        // )
        //   .then((res) => res.json());

        setRestaurants(Data.meal);
        setRestaurantsAtom({restaurants: Data.meal});
      } catch (error) {
        console.error('Error On KAKAO API(GET Dong Name):', error);
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
          });

          // 마커에 표시할 인포윈도우를 생성합니다
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `${ReactDOMServer.renderToString(<Restaurant {...restaurants?.[i]} />)}`,
          });

          // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
          // 이벤트 리스너로는 클로저를 만들어 등록합니다
          // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
          window.kakao.maps.event.addListener(
            restaurantMarker,
            'mouseover',
            makeOverListener(map, restaurantMarker, infowindow),
          );
          window.kakao.maps.event.addListener(restaurantMarker, 'mouseout', makeOutListener(infowindow));
          window.kakao.maps.event.addListener(restaurantMarker, 'click', () => {
            navigateTo(map, restaurants?.[i], dongName ?? '')();
          });
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

  return <>{children}</>;
};

export default MapProvider;
