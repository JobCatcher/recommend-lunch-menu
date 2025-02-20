import React, {useCallback, useEffect, useRef, useState} from 'react';
// import Data from '../../data/data.json';
import {KakaoMap, KakaoNamespace, Position} from '../types/kakao';
import {RestaurantInfo} from '../types/restaurant';
import {useAtom} from 'jotai';
import {restaurantMarkersAtom, restaurantsAtom} from '../stores/restaurantAtom';
import {mapAtom} from '../stores/mapAtom';
import {addClusterer, centerChangedHandler, zoomChangedHandler} from '../services/kakaoMap';
import styled from '@emotion/styled';

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

const DEFAULT_ZOOM_LEVEL = 3;

const MapProvider = ({children}: {children: React.ReactElement}) => {
  // let map: KakaoMap;
  // const toBeMap: Array<[number, KakaoMarker]> = [];

  const mapRef = useRef<KakaoMap>();
  const [isLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  // 사용자가 접속한 좌표(기본값: 서울 중심 좌표)
  const [userAccessPosition, setUserAccessPosition] = useState<Position>({
    latitude: 37.5665,
    longitude: 126.978,
    // latitude: 0,
    // longitude: 0,
  });

  // 사용자가 드래그 할 때 변경되는 좌표
  const [draggedPosition, setDraggedPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);

  const mapKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapKey}&autoload=false&libraries=clusterer`;
  script.defer = true;

  const [, setMapAtom] = useAtom(mapAtom);
  const [, setRestaurantsAtom] = useAtom(restaurantsAtom);
  const [restaurantMarkersMap] = useAtom(restaurantMarkersAtom);

  const setMarkers = (map: KakaoMap, restaurants?: RestaurantInfo[]) => {
    /**
     * TODO
     * 마커클러스터러 최초 1번만 생성되도록
     */
    if (restaurants?.length) {
      // 마커 클러스터러를 생성합니다
      const clusterer = addClusterer(map, restaurants || [], userAccessPosition);

      window.kakao.maps.event.addListener(clusterer, 'clusterclick', function (cluster: any) {
        // 현재 지도 레벨에서 1레벨 확대한 레벨
        const level = map.getLevel() - 1;

        // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
        map.setLevel(level, {anchor: cluster.getCenter()});
      });

      return;
    }
  };

  const onLoadKakaoMap = useCallback(
    async (latitude: number, longitude: number) => {
      window.kakao.maps.load(() => {
        console.log('kakaomap load 실행');

        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: zoomLevel, // 지도 확대 레벨
        };

        // 지도 생성
        if (!mapRef.current || !Object.keys(mapRef.current).length) {
          mapRef.current = new window.kakao.maps.Map(container, options);
        }

        // 지도에 현 위치 마커 추가
        const currentPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const currentPositionMarker = new window.kakao.maps.Marker({
          position: currentPosition,
        });

        // 음식점 마커 생성 및 표시
        setMarkers(mapRef.current);

        currentPositionMarker.setMap(mapRef.current!);
        setMapAtom(mapRef.current!);

        window.kakao.maps.event.addListener(mapRef.current, 'dragend', () =>
          centerChangedHandler(mapRef.current!, restaurants, setDraggedPosition),
        );
        window.kakao.maps.event.addListener(mapRef.current, 'zoom_changed', () =>
          zoomChangedHandler(mapRef.current!, setZoomLevel),
        );
      });
    },
    [draggedPosition],
  );

  const getRestaurants = useCallback(
    async (initLatitude?: number, initLongitude?: number) => {
      console.log('getRestaunts() 실행');

      const latitude = initLatitude || draggedPosition.latitude;
      const longitude = initLongitude || draggedPosition.longitude;

      try {
        const {data, statusText, message} = await fetch(
          `https://api.jobcatcher.shop/restaurants/search/v3?latitude=${latitude}&longitude=${longitude}`,
          // `https://api.jobcatcher.shop/restaurants/search/all`,
        ).then(res => res.json());

        console.log(`latitude(${latitude}), longitude(${longitude})의 식당: `, data);

        if (statusText !== 'OK') {
          throw new Error(`${latitude}, ${longitude}에서 음식점 정보를 가져오는 중 에러가 발생했습니다 | ${message}`);
        }

        // return Data.meal;
        // return [];
        const {markers} = restaurantMarkersMap;
        if (markers.size && !data.length) {
          console.log('remove: ', markers.get(1));

          for (const key of Object.keys(markers)) {
            markers.get(parseInt(key))?.setMap(null);
          }
        }

        return data;
      } catch (error) {
        console.error(error);
      }
    },
    [draggedPosition],
  );

  const initializeMap = useCallback(
    async (initLatitude: number, initLongitude: number) => {
      console.log(
        '최초 접속 위,경도: ',
        initLatitude,
        initLongitude,
        ' 사용자 움직인 위도, 경도:',
        draggedPosition.latitude,
        draggedPosition.longitude,
      );

      document.head.appendChild(script);
      script.addEventListener('load', () => onLoadKakaoMap(initLatitude, initLongitude));

      return () => {
        // 컴포넌트 언마운트 시 스크립트 제거
        document.head.removeChild(script);
        script.removeEventListener('load', () => onLoadKakaoMap(initLatitude, initLongitude));

        if (mapRef.current) {
          // window.kakao.maps.event.removeListener(mapRef.current, 'dragend', () =>
          //   centerChangedHandler(mapRef.current!, setDraggedPosition),
          // );
          // window.kakao.maps.eveant.removeListener(mapRef.current, 'zoom_changed', () =>
          //   zoomChangedHandler(mapRef.current!, setZoomLevel),
          // );
        }
      };
    },
    [draggedPosition],
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async position => {
      const {latitude, longitude} = position.coords;
      console.log('zoom LV: ', zoomLevel);
      console.log('사용자 접속 위치: ', latitude, longitude);

      await getRestaurants(latitude, longitude);
      await initializeMap(latitude, longitude);
      setUserAccessPosition({latitude, longitude});
    });
  }, []);

  useEffect(() => {
    (async () => {
      const {latitude, longitude} = draggedPosition;

      // 최초에는 위,경도가 0으로 이 경우에는 호출 x
      if (!latitude && !longitude && zoomLevel === DEFAULT_ZOOM_LEVEL) return;

      console.log('여긴 나옴');

      await getRestaurants().then(res => {
        setRestaurants(res);
        setRestaurantsAtom({restaurants: res});
        // if (mapRef.current) addRestaurantMarkersOnMap(mapRef.current, res || []);

        if (mapRef.current) setMarkers(mapRef.current, res);
      });
    })();
  }, [draggedPosition]);

  // forwardRef
  const renderChildren = () => {
    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        mapRef,
      });
    });
  };

  return <MapContainer>{isLoading ? <>loading...</> : <>{renderChildren()}</>}</MapContainer>;
};

export default MapProvider;

const MapContainer = styled.div`
  width: 100%;
  padding: 0 20px;
`;
