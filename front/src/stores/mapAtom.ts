import {atom} from 'jotai';
import {KakaoInfoWindow, KakaoMap, KakaoMarker} from '../types/kakao';

export const mapAtom = atom<KakaoMap | null>(null);
export const markerAtom = atom<KakaoMarker | null>(null);
export const infoWindowAtom = atom<KakaoInfoWindow | null>(null);
