import './App.css';
import './reset.css';
import LunchMenu from './components/LunchMenu';
import styled from '@emotion/styled';
import MapProvider from './components/MapProvider';
import {isMobile} from './utils/utils';

function App() {
  const mobile = isMobile();

  let width = mobile ? '300px' : '700px';
  let height = mobile ? '400px' : '800px';

  return (
    <MapProvider>
      <HomeContainer>
        <MainTitle>오늘의 점심</MainTitle>
        <Flex>
          <div id="map" style={{width, height}}></div>
          <LunchMenu />
        </Flex>
      </HomeContainer>
    </MapProvider>
  );
}

export default App;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 320px) {
    width: 320px;
  }
`;

const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 12px 0;
`;

const Flex = styled.div`
  display: flex;
  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: center;
  }
`;
