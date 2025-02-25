import {getDefaultStore} from 'jotai';
import {KakaoCustomOverlay, KakaoMap, KakaoMarker, Position} from '../types/kakao';
import {RestaurantInfo} from '../types/restaurant';
import {getDongName, navigateToRestaurant, setActiveMarker} from '../utils/utils';
import {customOverayAtom, markerAtom} from '../stores/mapAtom';
import {clickedRestaurantAtom} from '../stores/restaurantAtom';
import RestaurantOverlay from '../components/RestaurantOverlay';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

// map 중심 좌표가 변경된 경우, 새로운 식당 데이터를 가져올 수 있도록 trigger 합니다.
export const centerChangedHandler = (
  map: KakaoMap,
  restaurants: RestaurantInfo[],
  setDraggedPosition: React.Dispatch<React.SetStateAction<Position>>,
) => {
  const latLng = map.getCenter();
  console.log(restaurants);

  setDraggedPosition({latitude: latLng.getLat(), longitude: latLng.getLng()});
};

export const zoomChangedHandler = (map: KakaoMap, setZoomLevel: React.Dispatch<React.SetStateAction<number>>) => {
  // 지도의 현재 레벨을 얻어옵니다
  const level = map.getLevel();
  console.log('lv: ', level);
  setZoomLevel(level);
};

// 인포윈도우 내 닫기 버튼 클릭 시 인포윈도우 닫히는 이벤트
export const addEvListenerOnCustomOverlay = async (
  activeMarker: KakaoMarker,
  customOverlay: KakaoCustomOverlay,
  restaurant: RestaurantInfo,
) => {
  const closeButton = document.querySelector('[alt="close"]');
  const overlayWrapper = document.querySelector('[id="restaurant-overlay"]');

  console.log('close: ', closeButton);

  if (closeButton) {
    closeButton.addEventListener('click', e => {
      e.stopPropagation();
      activeMarker.setMap(null);
      customOverlay.setMap(null);
    });
  }

  if (overlayWrapper) {
    overlayWrapper.addEventListener('click', async e => {
      e.stopPropagation();

      const data = await getDongName(restaurant.longitude, restaurant.latitude);
      navigateToRestaurant(restaurant.title, data);
    });
  }
};

// 식당 마커 클릭 시 오픈되며, 인포윈도우를 표시하는 클로저를 만드는 함수입니다
export const markerClickCallback = (map: KakaoMap, customOverlay: KakaoCustomOverlay, restaurant: RestaurantInfo) => {
  return () => {
    const {latitude, longitude, restaurantId} = restaurant;
    const store = getDefaultStore();
    const activeOverayAtom = store.get(customOverayAtom);
    const activeMarkerAtom = store.get(markerAtom);

    // close previous customOverlay
    activeOverayAtom?.setMap(null);

    // 1. delete prev activeMarker
    // 2. put new activeMarker
    const activeMarker = setActiveMarker(map, activeMarkerAtom!, latitude, longitude);

    // open new customOverlay
    customOverlay.setMap(map);

    store.set(customOverayAtom, customOverlay);
    store.set(markerAtom, activeMarker);
    store.set(clickedRestaurantAtom, {activeRestaurantId: restaurantId});

    // add eventListener On close button
    addEvListenerOnCustomOverlay(activeMarker, customOverlay, restaurant);
  };
};

export const addClusterer = (map: KakaoMap, restaurants: RestaurantInfo[], currentPosition: Position) => {
  const clusterer = new window.kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minLevel: 3, // 클러스터 할 최소 지도 레벨
    disableClickZoom: true,
  });

  const markers = restaurants.map(({latitude, longitude, ...rest}) => {
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(latitude, longitude),
    });

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(latitude + 0.00045, longitude - 0.00045), // 마커를 표시할 위치
      content: `${ReactDOMServer.renderToString(
        React.createElement(RestaurantOverlay, {restaurant: {...rest, latitude, longitude}, currentPosition}),
      )}`,
      xAnchor: 0.3,
      yAnchor: 0.91,
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      markerClickCallback(map, customOverlay, {...rest, latitude, longitude})();
    });

    return marker;
  });

  clusterer.addMarkers(markers);
  console.log('add clusterer finishied');

  return clusterer;
};
