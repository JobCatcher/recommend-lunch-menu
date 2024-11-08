import { useEffect, useState } from "react";
import data from "../../data/restaurants.json";
import styled from "@emotion/styled";

interface RestaurantInfo {
  번호: string;
  품목: string;
  상호: string;
  구: string;
  주소: string;
  전화번호: string;
  결제방법: string;
}

interface LunchMenuProps {
  isClicked: boolean;
}

const LunchMenu = ({ isClicked }: LunchMenuProps) => {
  const [restaurants, setResaurants] = useState<RestaurantInfo[]>([]);

  const filterRestaurantsNearSuNe = () => {
    const filteredRestaurants = data.filter((restaurant) => {
      return restaurant.주소.includes("수내"); // || restaurant.주소.includes("황새울로")
    });
    return filteredRestaurants;
  };

  const handleClickRestaurant = async (storeName: string) => {
    const name = !storeName.includes("수내")
      ? `수내역 ${storeName}`
      : storeName;

    // window.open(
    //   `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${name}`,
    //   "_blank"
    // );
    // window.open(`https://map.naver.com/v5/search/${name}`, "_blank");
    console.log("dda: ", `http://localhost:5000/api/scrape?query=${name}`);

    const result = await fetch(
      `http://localhost:5000/api/scrape?query=${name}`
    );
    console.log("re: ", result);
  };

  useEffect(() => {
    if (isClicked) {
      setResaurants(filterRestaurantsNearSuNe());
    }
  }, [isClicked]);

  return (
    <div>
      <h2>Lunch Menu</h2>
      <table>
        <thead>
          <tr>
            <th>상호</th>
            <th>위치</th>
            <th>결제방법</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <StyledRow
              key={restaurant.번호}
              onClick={() => handleClickRestaurant(restaurant.상호)}
            >
              <td>{restaurant.상호}</td>
              <td>{restaurant.주소}</td>
              <td>{restaurant.결제방법}</td>
            </StyledRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LunchMenu;

const StyledRow = styled.tr`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
