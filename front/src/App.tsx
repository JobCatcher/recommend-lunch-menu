import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LunchMenu from "./components/LunchMenu";

function Map() {
  const mapKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      // Kakao Maps SDK 로드 후 초기화
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
          level: 3, // 지도 확대 레벨
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options);

        // 지도에 마커 추가 (옵션)
        const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.978);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, [mapKey]);

  return <div id="map" style={{ width: "500px", height: "400px" }}></div>;
}

function App() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>오늘의 점심</h1>
      <div className="card">
        <button onClick={() => setIsClicked(true)}>추천받기</button>
      </div>
      <Map />
      {isClicked && <LunchMenu isClicked={isClicked} />}
    </>
  );
}

export default App;
