import { useState } from "react";
import "./App.css";
import "./reset.css";
import LunchMenu from "./components/LunchMenu";
import Map from "./components/Map";
import styled from "@emotion/styled";

function App() {
  const [isClicked, setIsClicked] = useState(true);

  return (
    <HomeContainer>
      <h1>오늘의 점심</h1>
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
