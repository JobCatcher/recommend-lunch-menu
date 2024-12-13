import {useEffect, useState} from 'react';
import Data from '../../data/data.json';
import ReactDOMServer from 'react-dom/server';
import {setActiveMarker, triggerEvent} from '../utils/utils';
import {KakaoCustomOverlay, KakaoMap, KakaoMarker, KakaoNamespace} from '../types/kakao';
import {RestaurantInfo} from '../types/restaurant';
import {getDefaultStore, useAtom, useAtomValue} from 'jotai';
import {clickedRestaurantAtom, restaurantMarkersAtom, restaurantsAtom} from '../stores/restaurantAtom';
import {customOverayAtom, mapAtom, markerAtom, zoomLevelAtom} from '../stores/mapAtom';
import RestaurantOverlay from './RestaurantOverlay';

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

const MapProvider = ({children}: {children: React.ReactNode}) => {
  let map: KakaoMap;
  let toBeMap: Array<[number, KakaoMarker]> = [];

  const [isLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  // 서울 중심 좌표
  const [coordinates, setCoordinates] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  });
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  const mapKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const [, setMapAtom] = useAtom(mapAtom);
  const [, setRestaurantsAtom] = useAtom(restaurantsAtom);
  const [{markers}, setRestaurantMarkersAtom] = useAtom(restaurantMarkersAtom);
  const {activeRestaurantId} = useAtomValue(clickedRestaurantAtom);
  const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);

  // 인포윈도우 내 닫기 버튼 클릭 시 인포윈도우 닫히는 이벤트
  const closeInfoWindow = (activeMarker: KakaoMarker, customOverlay: KakaoCustomOverlay) => {
    const closeButton = document.querySelector('[alt="close"]');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        activeMarker.setMap(null);
        customOverlay.setMap(null);
      });
    }
  };

  // 식당 마커 클릭 시 오픈되며, 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  const clickListener = (map: KakaoMap, customOverlay: KakaoCustomOverlay, restaurant: RestaurantInfo) => {
    return () => {
      const {latitude, longitude, id} = restaurant;
      const store = getDefaultStore();
      const activeOverayAtom = store.get(customOverayAtom);
      const activeMarkerAtom = store.get(markerAtom);

      if (activeOverayAtom !== customOverlay) {
        // close previous customOverlay
        activeOverayAtom?.setMap(null);

        // 1. delete prev activeMarker
        // 2. put new activeMarker
        const activeMarker = setActiveMarker(map, activeMarkerAtom, latitude, longitude);

        // open new customOverlay
        customOverlay.setMap(map);

        store.set(customOverayAtom, customOverlay);
        store.set(markerAtom, activeMarker);
        store.set(clickedRestaurantAtom, {activeRestaurantId: id});

        // add eventListener On close button
        closeInfoWindow(activeMarker, customOverlay);
        return;
      }
    };
  };

  const centerChangedHandler = (map: KakaoMap) => {
    const latLng = map.getCenter();
    setCoordinates({latitude: latLng.getLat(), longitude: latLng.getLng()});
  };

  const zoomChangedHandler = (map: KakaoMap) => {
    // 지도의 현재 레벨을 얻어옵니다
    const level = map.getLevel();
    setZoomLevel(level);
  };

  const setMarkers = (map: KakaoMap) => {
    const restaurantMarkers: KakaoMarker[] = new Array(restaurants.length);
    const restaurantMarkerImage = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const {latitude, longitude} = coordinates;

    if (zoomLevel > 5) {
      const circleImage =
        'https://maps-service.pstatic.net/pcweb_navermap_v5/241212-c6893f5/assets/sprites/new_marker@2x.png';
      const imageSize = new window.kakao.maps.Size(24, 24);

      // 마커 이미지를 생성
      const markerImage = new window.kakao.maps.MarkerImage(Circle, imageSize);

      // 마커 생성
      new window.kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: new window.kakao.maps.LatLng(latitude, longitude), // 마커를 표시할 위치
        image: markerImage, // 마커 이미지
        clickable: true,
      }).setZIndex(1);

      return;
    }

    for (let i = 0; i < restaurants?.length; i++) {
      const latlng = new window.kakao.maps.LatLng(restaurants?.[i].latitude, restaurants?.[i].longitude);
      const imageSize = new window.kakao.maps.Size(24, 35);

      // 마커 이미지를 생성
      const markerImage = new window.kakao.maps.MarkerImage(restaurantMarkerImage, imageSize);

      // 마커 생성
      restaurantMarkers[i] = new window.kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: latlng, // 마커를 표시할 위치
        image: markerImage, // 마커 이미지
        clickable: true,
      });

      // 마커에 표시될 customOverlay
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(
          restaurants?.[i].latitude + 0.00045,
          restaurants?.[i].longitude - 0.00045,
        ), // 마커를 표시할 위치
        content: `${ReactDOMServer.renderToString(<RestaurantOverlay restaurant={restaurants?.[i]} />)}`,
        xAnchor: 0.3,
        yAnchor: 0.91,
      });

      toBeMap.push([restaurants?.[i].id, restaurantMarkers[i]]);

      window.kakao.maps.event.addListener(
        restaurantMarkers[i],
        'click',
        clickListener(map, customOverlay, restaurants?.[i]),
      );
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async position => {
      const {latitude, longitude} = position.coords;
      setCoordinates({latitude, longitude});
      setCurrentPosition({latitude, longitude});
    });
  }, []);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        // const {longitude, latitude} = coordinates;
        // const data = await getDongName(longitude, latitude);
        // dongName = data;

        // const fetchRestaurants = await fetch(
        //   `http://192.168.166.48:8080/restaurants/search?latitude=${latitude}&longitude=${longitude}`,
        //   // `http://192.168.166.48:8080/restaurants/all`,
        // ).then(res => res.json());

        // console.log('음식점 data: ', fetchRestaurants);

        setRestaurants(Data.meal);
        setRestaurantsAtom({restaurants: Data.meal});
        // setRestaurants(fetchRestaurants);
        // setRestaurantsAtom({restaurants: fetchRestaurants});
      } catch (error) {
        console.error('Error On KAKAO API(GET Dong Name):', error);
      } finally {
      }
    };
    getRestaurants();
  }, [coordinates]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapKey}&autoload=false`;
    script.async = true;

    const {latitude, longitude} = coordinates;
    const {latitude: curLat, longitude: curLong} = currentPosition;
    console.log('위도&경도: ', latitude, longitude);

    if (!latitude && !longitude) {
      throw new Error('위치 정보를 받아오지 못하였습니다.');
    }

    script.onload = () => {
      // Kakao Maps SDK 로드 후 초기화
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: zoomLevel, // 지도 확대 레벨
        };

        // 지도 생성
        map = new window.kakao.maps.Map(container, options);

        // 음식점 마커 생성 및 표시
        setMarkers(map);

        // 지도에 마커 추가 (옵션)
        const currentPosition = new window.kakao.maps.LatLng(curLat, curLong);
        const currentPositionMarker = new window.kakao.maps.Marker({
          position: currentPosition,
        });

        window.kakao.maps.event.addListener(map, 'dragend', () => centerChangedHandler(map));
        window.kakao.maps.event.addListener(map, 'zoom_changed', () => zoomChangedHandler(map));

        currentPositionMarker.setMap(map);
        setMapAtom(map);
        setRestaurantMarkersAtom({markers: new Map<number, KakaoMarker>(toBeMap)});
      });
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, [zoomLevel, coordinates, restaurants, mapKey]);

  return <>{isLoading ? <>loading...</> : children}</>;
};

export default MapProvider;
