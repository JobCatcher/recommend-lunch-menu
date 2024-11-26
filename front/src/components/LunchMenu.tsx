import { useState } from "react";
import data from "../../data/data.json";
import styled from "@emotion/styled";

import Restaurant from "./Restaurant";
import { RestaurantInfo } from "../types/restaurant";

const LunchMenu = () => {
  const [restaurants] = useState<RestaurantInfo[]>(data);

  return (
    <LunchMenuContainer>
      <StyledText>추천 메뉴</StyledText>
      <LunchMenuWrapper>
        {restaurants.map((restaurant, idx) => {
          return (
            <Restaurant key={`${restaurant.title}-${idx}`} {...restaurant} />
          );
        })}
      </LunchMenuWrapper>
    </LunchMenuContainer>
  );
};

export default LunchMenu;

const LunchMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledText = styled.h2`
  font-size: 24px;
  font-weight 600;
  margin: 16px 0;
`;

const LunchMenuWrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  width: 100%;
  place-items: center;
`;
