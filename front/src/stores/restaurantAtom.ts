import {atom} from 'jotai';
import {RestaurantInfo} from '../types/restaurant';

export const clickedRestaurantAtom = atom({
  activeRestaurantId: 0,
});

export const restaurantsAtom = atom<{restaurants: RestaurantInfo[]}>({
  restaurants: [],
});
