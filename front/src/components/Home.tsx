import styled from '@emotion/styled';
import LunchMenu from './LunchMenu';
import {isMobile} from '../utils/utils';
import React from 'react';

const Home = React.forwardRef<HTMLDivElement>((_, mapRef) => {
  const mobile = isMobile();

  const width = mobile ? '300px' : '700px';
  const height = mobile ? '400px' : '800px';

  return (
    <HomeContainer>
      <MainTitle>오늘의 점심</MainTitle>
      <Flex>
        <div id="map" ref={mapRef} style={{width, height}}></div>
        <LunchMenu />
      </Flex>
    </HomeContainer>
  );
});

export default Home;

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
