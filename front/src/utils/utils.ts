import {getDefaultStore} from 'jotai';
import {KakaoMap, KakaoMarker, Position} from '../types/kakao';
import {markerAtom} from '../stores/mapAtom';
import RestaurantOverlay from '../components/RestaurantOverlay';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import {RestaurantInfo} from '../types/restaurant';
import {markerClickCallback} from '../services/kakaoMap';

/**
 * 1 - km
 * 1000 - m
 */
export const DISTANCE = 1000;

export const navigateToRestaurant = (storeName: string, dongName?: string) => {
  const name = dongName ? `${dongName} ${storeName}` : `수내역 ${storeName}`;

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
  const isMobile = navigator.userAgent.includes('Mobi');

  return isMobile;
};

export const setActiveMarker = (map: KakaoMap, activeMarkerAtom: KakaoMarker, latitude: number, longitude: number) => {
  if (activeMarkerAtom) {
    activeMarkerAtom.setMap(null);
  }

  const store = getDefaultStore();

  const imageSrc = '/active.png';
  const imageSize = new window.kakao.maps.Size(28, 38);
  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

  const marker = new window.kakao.maps.Marker({
    map: map!,
    position: new window.kakao.maps.LatLng(latitude, longitude),
    image: markerImage,
  });

  marker.setMap(map);
  store.set(markerAtom, marker);
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

export const makeCustomOverlay = (
  latitude: number,
  longitude: number,
  currentPosition: Position,
  rest: Omit<RestaurantInfo, 'latitude' | 'longitude'>,
) => {
  return new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(latitude + 0.00045, longitude - 0.00045), // 마커를 표시할 위치
    content: `${ReactDOMServer.renderToString(
      React.createElement(RestaurantOverlay, {restaurant: {...rest, latitude, longitude}, currentPosition}),
    )}`,
    xAnchor: 0.3,
    yAnchor: 0.91,
  });
};

/**
 * map에 clusterer로 들어갈 restaurant marker 및 marker 클릭 시 띄워질 Overlay 생성.
 * @param map
 * @param restaurants
 * @param currentPosition
 * @returns
 */
export const initializeMarkersOnMap = (map: KakaoMap, restaurants: RestaurantInfo[], currentPosition: Position) => {
  return restaurants.map(({latitude, longitude, ...rest}) => {
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(latitude, longitude),
    });

    const customOverlay = makeCustomOverlay(latitude, longitude, currentPosition, rest);

    window.kakao.maps.event.addListener(marker, 'click', () => {
      markerClickCallback(map, customOverlay, {...rest, latitude, longitude})();
    });

    return {restaurantId: rest.restaurantId, marker};
  });
};
