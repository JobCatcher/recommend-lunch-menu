import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LunchMenu from "./components/LunchMenu";

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
      {isClicked && <LunchMenu isClicked={isClicked} />}
    </>
  );
}

export default App;
