import {atom} from 'jotai';
import {RestaurantInfo, RestaurantMarkersAtom} from '../types/restaurant';
import {KakaoMarker} from '../types/kakao';

export const clickedRestaurantAtom = atom({
  activeRestaurantId: 0,
});

export const restaurantsAtom = atom<{restaurants: RestaurantInfo[]}>({
  restaurants: [],
});

export const restaurantMarkersAtom = atom<RestaurantMarkersAtom>({
  restaurantsMarker: new Map<number, KakaoMarker>(),
});
