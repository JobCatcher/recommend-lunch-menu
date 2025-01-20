import {atom} from 'jotai';
import {KakaoCustomOverlay, KakaoMap, KakaoMarker} from '../types/kakao';

export const mapAtom = atom<KakaoMap | null>(null);
export const markerAtom = atom<KakaoMarker | null>(null);
export const customOverayAtom = atom<KakaoCustomOverlay | null>(null);

export const zoomLevelAtom = atom<number>(3);
