import React, {useCallback, useEffect, useRef, useState} from 'react';
import {KakaoMap, KakaoNamespace, Position} from '../types/kakao';
import {clustererAtom, RestaurantInfo, RestaurantMarkersAtom} from '../types/restaurant';
import {useAtom} from 'jotai';
import {clustererMarkerAtom, restaurantMarkersAtom, restaurantsAtom} from '../stores/restaurantAtom';
import {mapAtom} from '../stores/mapAtom';
import {addMarkersAndClusterer, centerChangedHandler, zoomChangedHandler} from '../services/kakaoMap';
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
  const [restaurantsMarkerAtom, setRestaurantsMarkerAtom] = useAtom<RestaurantMarkersAtom>(restaurantMarkersAtom);
  const [clusterersMarkerAtom, setClusterersMarkerAtom] = useAtom<clustererAtom>(clustererMarkerAtom);

  const setMarkersAndClusterer = (map: KakaoMap, restaurants?: RestaurantInfo[]) => {
    /**
     * TODO
     * 마커클러스터러 최초 1번만 생성되도록
     */
    let clustererInstance;
    if (!clusterersMarkerAtom.clutererMarker.size) {
      clustererInstance = new window.kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: 3, // 클러스터 할 최소 지도 레벨
        disableClickZoom: true,
      });

      setClusterersMarkerAtom({
        clutererMarker: new Map().set('clusterer', clustererInstance),
      });
    }

    // 마커 생성 후 clusterer에 추가합니다
    const {markers, clusterer} = addMarkersAndClusterer(
      map,
      clusterersMarkerAtom.clutererMarker.get('clusterer') || clustererInstance!,
      restaurantsMarkerAtom,
      restaurants || [],
      userAccessPosition,
    );

    setRestaurantsMarkerAtom({
      restaurantsMarker: new Map(markers.map(({restaurantId, marker}) => [restaurantId, marker])),
    });

    // console.log('clusterer: ', clusterer);
    // clusterer.clear();

    // setClustererMarkerAtom({
    //   // clutererMarker: new Map(markers.map(({restaurantId, marker}) => [restaurantId, marker])),
    //   // clutererMarker: new Map(clusterer.map(({restaurantId, marker}) => [restaurantId, marker])),
    // });

    window.kakao.maps.event.addListener(clusterer, 'clusterclick', function (cluster: any) {
      // 현재 지도 레벨에서 1레벨 확대한 레벨
      const level = map.getLevel() - 1;

      // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
      map.setLevel(level, {anchor: cluster.getCenter()});
    });

    return;
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

        // 음식점 마커 및 클러스터러 마커 생성
        setMarkersAndClusterer(mapRef.current);

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
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              restaurantIds: restaurants.map(({restaurantId}) => restaurantId),
            }),
          },
        ).then(res => res.json());

        console.log(`latitude(${latitude}), longitude(${longitude})의 식당: `, data);

        if (statusText !== 'OK') {
          throw new Error(`${latitude}, ${longitude}에서 음식점 정보를 가져오는 중 에러가 발생했습니다 | ${message}`);
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
      };
    },
    [draggedPosition],
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async position => {
      const {latitude, longitude} = position.coords;
      console.log('zoom LV: ', zoomLevel);
      console.log('사용자 접속 위치: ', latitude, longitude);

      // await getRestaurants(latitude, longitude);
      // await initializeMap(latitude, longitude);
      await getRestaurants(37.3727, 127.1229);
      await initializeMap(37.3727, 127.1229);
      setUserAccessPosition({latitude, longitude});
    });
  }, []);

  useEffect(() => {
    (async () => {
      const {latitude, longitude} = draggedPosition;

      // 최초에는 위,경도가 0으로 이 경우에는 호출 x
      if (!latitude && !longitude && zoomLevel === DEFAULT_ZOOM_LEVEL) return;

      await getRestaurants().then(res => {
        const {
          restaurants: newRestaurants,
          removeRestaurantIds,
        }: {restaurants: RestaurantInfo[]; removeRestaurantIds: number[]} = res;

        const _final = newRestaurants.length
          ? restaurants.concat(newRestaurants).filter(({restaurantId}) => !removeRestaurantIds.includes(restaurantId))
          : restaurants.filter(({restaurantId}) => !removeRestaurantIds.includes(restaurantId));

        console.log('final: ', _final);

        setRestaurants(_final);
        setRestaurantsAtom({restaurants: _final});

        // 지도가 있고, 마커 데이터(새롭게 추가, 삭제)의 변화가 있는 경우
        // marker와 clusterer를 새로 그린다.
        if (mapRef.current && (newRestaurants.length || removeRestaurantIds.length)) {
          setMarkersAndClusterer(mapRef.current, _final);
        }

        if (removeRestaurantIds.length) {
          const {restaurantsMarker} = restaurantsMarkerAtom;
          removeRestaurantIds.forEach(id => {
            console.log('지워져야할 식당: ', id, restaurantsMarker.get(id));
            restaurantsMarker.get(id)?.setMap(null);
          });
        }
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
`;
