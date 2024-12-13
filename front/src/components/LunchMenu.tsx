import styled from '@emotion/styled';

import Restaurant from './Restaurant';
import {useAtomValue} from 'jotai';
import {restaurantsAtom} from '../stores/restaurantAtom';

const LunchMenu = () => {
  const {restaurants} = useAtomValue(restaurantsAtom);

  const getContents = () => {
    if (!restaurants.length) {
      return <li>추천메뉴가 없습니다..🥲</li>;
    }
    return (
      <>
        {restaurants.map((restaurant, idx) => {
          return <Restaurant key={`${restaurant.title}-${idx}`} {...restaurant} />;
        })}
      </>
    );
  };

  return (
    <LunchMenuContainer>
      <StyledText>추천 메뉴</StyledText>
      <LunchMenuWrapper noContents={!restaurants.length}>{getContents()}</LunchMenuWrapper>
    </LunchMenuContainer>
  );
};

export default LunchMenu;

const LunchMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 800px;
  overflow: scroll;
`;

const StyledText = styled.h2`
  font-size: 24px;
  font-weight 600;
  margin: 16px 0;
`;

const LunchMenuWrapper = styled.ul<{noContents: boolean}>`
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  place-items: center;
  @media screen and (max-width: 1400px) {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({noContents}) => (noContents ? `display: flex; min-width: 500px; justify-content: center;` : '')}
`;
