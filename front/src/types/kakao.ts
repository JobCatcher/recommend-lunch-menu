export interface KakaoNamespace {
  maps: KakaoMaps;
}

interface KakaoMaps {
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  Map: new (container: HTMLElement | null, options: KakaoMapOptions) => KakaoMap;
  Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
  InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
  CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoCustomOverlay;
  MarkerImage: new (src: string, size: KakaoSize) => KakaoMarkerImage;
  MarkerClusterer: new (options: KakaoMarkerClustererOptions) => KakaoMarkerClusterer;
  Size: new (width: number, height: number) => KakaoSize;
  load: (callback: () => void) => void;
  event: {
    trigger: (target: KakaoMarker | KakaoMap, type: string) => void;
    addListener: (target: KakaoMarker | KakaoMap, type: string, callback: (...args: unknown[]) => void) => void;
    removeListener: (target: KakaoMarker | KakaoMap, type: string, callback: (...args: unknown[]) => void) => void;
  };
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

export interface KakaoMap {
  panTo(latlng: KakaoLatLng): void;
  setCenter: (latlng: KakaoLatLng) => void;
  getCenter: () => KakaoLatLng;
  getLevel: () => number;
}

interface KakaoMarkerOptions {
  map?: KakaoMap;
  position: KakaoLatLng;
  image?: KakaoMarkerImage;
  clickable?: boolean;
}

export interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
  setZIndex: (index: number) => void;
}

interface KakaoInfoWindowOptions {
  content?: string;
  removable?: boolean;
  position?: KakaoLatLng;
}

interface KakaoCustomOverlayOptions {
  content: string;
  position: KakaoLatLng;
  xAnchor?: number;
  yAnchor?: number;
}

export interface KakaoInfoWindow {
  open: (map: KakaoMap, marker: KakaoMarker) => void;
  close: () => void;
}

export interface KakaoCustomOverlay extends KakaoInfoWindow {
  setMap: (map: KakaoMap | null) => void;
}

type KakaoMarkerImage = object;

interface KakaoMarkerClustererOptions {
  map: KakaoMap; // 마커들을 클러스터로 관리하고 표시할 지도 객체
  averageCenter: boolean; // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
  minLevel: number;
  text?: string[];
}

interface KakaoMarkerClusterer {
  addMarkers(markers: KakaoMarker[]): unknown;
  map: KakaoMap; // 마커들을 클러스터로 관리하고 표시할 지도 객체
  averageCenter: boolean; // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
  minLevel: number; // 클러스터 할 최소 지도 레벨
  // addMarkers:;
}

interface KakaoSize {
  width: number;
  height: number;
}
