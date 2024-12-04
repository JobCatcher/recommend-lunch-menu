import {atom} from 'jotai';
import {KakaoMap, KakaoMarker} from '../types/kakao';

export const mapAtom = atom<KakaoMap | null>(null);
export const markerAtom = atom<KakaoMarker | null>(null);
