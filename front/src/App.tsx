import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LunchMenu from "./components/LunchMenu";
import data from "../data/data.json";

function Map() {
  const mapKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  function makeOverListener(map, marker, infowindow) {
    return function () {
      infowindow.open(map, marker);
    };
  }

  // 인포윈도우를 닫는 클로저를 만드는 함수입니다
  function makeOutListener(infowindow) {
    return function () {
      infowindow.close();
    };
  }

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

        const imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options);
        let marker;

        for (let i = 0; i < data.length; i++) {
          const imageSize = new kakao.maps.Size(24, 35);
          const latlng = new kakao.maps.LatLng(
            data[i].latitude,
            data[i].longitude
          );

          // 마커 이미지를 생성합니다
          const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

          // 마커를 생성합니다
          marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: latlng, // 마커를 표시할 위치
            // content: data[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지
          });

          // 마커에 표시할 인포윈도우를 생성합니다
          const infowindow = new kakao.maps.InfoWindow({
            content: `<div style='padding: 4px; font-size: 12px;'>${data[i].title}(${data[i].category}) 별점: ${data[i].rating}</div>`, // 인포윈도우에 표시할 내용
          });

          // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
          // 이벤트 리스너로는 클로저를 만들어 등록합니다
          // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
          window.kakao.maps.event.addListener(
            marker,
            "mouseover",
            makeOverListener(map, marker, infowindow)
          );
          window.kakao.maps.event.addListener(
            marker,
            "mouseout",
            makeOutListener(infowindow)
          );
        }

        // 지도에 마커 추가 (옵션)
        const currentPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        marker = new window.kakao.maps.Marker({
          position: currentPosition,
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
