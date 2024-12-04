import {atom} from 'jotai';
import {KakaoMap} from '../types/kakao';

export const mapAtom = atom<KakaoMap | null>(null);
