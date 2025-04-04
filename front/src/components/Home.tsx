import styled from '@emotion/styled';
import LunchMenu from './LunchMenu';
import {isMobile} from '../utils/utils';
import React, {useContext} from 'react';
import {GloablContext, Menu} from '../context/GlobalNavContext';
import DrawLots from './draw-lots/DrawLots';
import Chatting from './chatting/Chatting';

type Props = {
  setState: React.Dispatch<React.SetStateAction<Menu>>;
};

const Home = React.forwardRef<HTMLDivElement, Props>(({setState}, mapRef) => {
  const mobile = isMobile();
  const menu = useContext(GloablContext);

  const width = mobile ? '300px' : '1100px';
  const height = mobile ? '400px' : '800px';

  return (
    <HomeContainer>
      <MainTitle>오늘의 점심</MainTitle>
      <Flex>
        <LunchMenu />
        <div id="map" ref={mapRef} style={{width, height}} />
      </Flex>
      {menu.drawLots && <DrawLots setState={setState} />}
      {menu.chatting && <Chatting setState={setState} />}
    </HomeContainer>
  );
});

export default Home;

const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 12px 0;
`;

const Flex = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: 1000px) {
    flex-direction: column-reverse;
    align-items: center;
    > div#map {
      margin-bottom: 40px;
      width: 95% !important;
    }
  }
`;
