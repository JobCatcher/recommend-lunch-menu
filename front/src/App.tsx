import "./App.css";
import "./reset.css";
import LunchMenu from "./components/LunchMenu";
import Map from "./components/Map";
import styled from "@emotion/styled";

function App() {
  return (
    <HomeContainer>
      <MainTitle>오늘의 점심</MainTitle>
      <Flex>
        <Map />
        <LunchMenu />
      </Flex>
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

const Flex = styled.div`
  display: flex;
`;
