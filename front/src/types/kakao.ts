export interface KakaoNamespace {
  maps: KakaoMaps;
}

interface KakaoMaps {
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  Map: new (container: HTMLElement | null, options: KakaoMapOptions) => KakaoMap;
  Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
  InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
  MarkerImage: new (src: string, size: KakaoSize) => KakaoMarkerImage;
  Size: new (width: number, height: number) => KakaoSize;
  load: (callback: () => void) => void;
  event: {
    addListener: (target: KakaoMarker | KakaoMap, type: string, callback: (...args: unknown[]) => void) => void;
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
}

interface KakaoMarkerOptions {
  map?: KakaoMap;
  position: KakaoLatLng;
  image?: KakaoMarkerImage;
}

export interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
}

interface KakaoInfoWindowOptions {
  content: string;
}

export interface KakaoInfoWindow {
  open: (map: KakaoMap, marker: KakaoMarker) => void;
  close: () => void;
}

type KakaoMarkerImage = object;

interface KakaoSize {
  width: number;
  height: number;
}
