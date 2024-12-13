import {atom} from 'jotai';
import {RestaurantInfo} from '../types/restaurant';
import {KakaoMarker} from '../types/kakao';

export const clickedRestaurantAtom = atom({
  activeRestaurantId: 0,
});

export const restaurantsAtom = atom<{restaurants: RestaurantInfo[]}>({
  restaurants: [],
});

export const restaurantMarkersAtom = atom<{markers: Map<number, KakaoMarker>}>({
  markers: new Map<number, KakaoMarker>(),
});
