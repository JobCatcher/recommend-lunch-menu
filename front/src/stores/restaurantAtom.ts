import {atom} from 'jotai';
import {clustererAtom, RestaurantInfo, RestaurantMarkersAtom} from '../types/restaurant';
import {KakaoMarker, KakaoMarkerClusterer} from '../types/kakao';

export const clickedRestaurantAtom = atom({
  activeRestaurantId: 0,
});

export const restaurantsAtom = atom<{restaurants: RestaurantInfo[]}>({
  restaurants: [],
});

export const restaurantMarkersAtom = atom<RestaurantMarkersAtom>({
  restaurantsMarker: new Map<number, KakaoMarker>(),
});

export const clustererMarkerAtom = atom<clustererAtom>({
  clutererMarker: new Map<string, KakaoMarkerClusterer>(),
});
