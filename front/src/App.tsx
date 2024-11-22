import { useState } from "react";
import "./App.css";
import "./reset.css";
import LunchMenu from "./components/LunchMenu";
import Map from "./components/Map";
import styled from "@emotion/styled";

function Map() {
  const mapKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapKey}&autoload=false`;
    script.async = true;

    // 서울 중심 좌표
    let latitude: number = 37.5665,
      longitude: number = 126.978;

    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });

    script.onload = () => {
      // Kakao Maps SDK 로드 후 초기화
      window.kakao.maps.load(() => {
        if (!latitude && !longitude) {
          throw new Error("위치 정보를 받아오지 못하였습니다.");
        }
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3, // 지도 확대 레벨
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options);

        // 지도에 마커 추가 (옵션)
        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
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
  const [isClicked] = useState(true);

  return (
    <HomeContainer>
      <MainTitle>오늘의 점심</MainTitle>
      {/* <div className="card">
        <button onClick={() => setIsClicked(true)}>추천받기</button>
      </div> */}
      <Map />
      {isClicked && <LunchMenu isClicked={isClicked} />}
    </HomeContainer>
  );
}

export default App;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
`;
