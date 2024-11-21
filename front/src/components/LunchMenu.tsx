import { useEffect, useState } from "react";
// import data from "../../data/restaurants.json";
import data from "../../data/data.json";
import styled from "@emotion/styled";
import { getNumbers } from "../utils/utils";

// interface ReviewAndRating {
//   별점?: string;
//   방문자리뷰?: string;
//   블로그리뷰?: string;
// }

// interface RestaurantInfo extends ReviewAndRating {
//   번호: string;
//   품목: string;
//   상호: string;
//   구: string;
//   주소: string;
//   전화번호: string;
//   결제방법: string;
// }

interface ReviewAndRating {
  별점?: string;
  방문자리뷰?: string;
  블로그리뷰?: string;
}

interface RestaurantInfo extends ReviewAndRating {
  title: string;
  latitude: number;
  longitude: number;
  blogReview: string;
  countOfVisitorReview: number;
  rating: number;
  category: string;
  images: string[];
}

// const LunchMenuContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: 100%;
//   background-color: #f5f5f5;
//   padding: 20px;
//   box-sizing: border-box;
// `;

// const RestaurantList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
//   width: 100%;
//   max-width: 600px;
// `;

// const RestaurantItem = styled.li`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   justify-content: space-between;
//   background-color: #fff;
//   border-radius: 8px;
// }`;

interface LunchMenuProps {
  isClicked: boolean;
}

const LunchMenu = ({ isClicked }: LunchMenuProps) => {
  const [restaurants, setResaurants] = useState<RestaurantInfo[]>(data);

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

    window.open(
      `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${name}`,
      "_blank"
    );
    // window.open(`https://map.naver.com/v5/search/${name}`, "_blank");
    // console.log("dda: ", `http://localhost:5000/api/scrape?query=${name}`);
  };

  const getRestaurantReivewAndRating = async (name: string) => {
    const result = await fetch(
      `http://localhost:5000/api/scrape?query=${name}`
    );

    return await result.json();
  };

  useEffect(() => {
    // if (isClicked) {
    //   const restaurants = filterRestaurantsNearSuNe();
    //   initialize(restaurants).then((updated) => {
    //     setResaurants(updated);
    //   });
    // }
  }, [isClicked]);

  return (
    <LunchMenuContainer>
      <h2>recommended Menu</h2>
      <RestaurantContainer>
        {restaurants.map((restaurant, idx) => {
          const { title, countOfVisitorReview, rating, category, images } =
            restaurant;

          return (
            <RestaurantWrapper
              key={`${restaurant.title}-${idx}`}
              onClick={() => handleClickRestaurant(title)}
            >
              <ImageContainer>
                {images.map((image, idx) => {
                  return (
                    <img
                      key={`${restaurant.title}-${idx}`}
                      src={image || "https://via.placeholder.com/150"}
                      alt={`${title} 이미지`}
                    />
                  );
                })}
              </ImageContainer>
              <InfoContainer>
                <Title>{title}</Title>
                <Category>{category}</Category>
                {/* <Description>흑돼지요리사맛집</Description> */}
                <Review>리뷰: {countOfVisitorReview}</Review>
                <Rating>별점: {rating}</Rating>
              </InfoContainer>
            </RestaurantWrapper>
          );
        })}
      </RestaurantContainer>
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

const RestaurantContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  width: 100%;
  place-items: center;
`;
const RestaurantWrapper = styled.li`
  width: 50%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
  }
  cursor: pointer;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  display: flex;
  margin-bottom: 12px;
  width: 90%;
  overflow-x: scroll;

  img {
    width: 150px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const InfoContainer = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px;
`;

const Category = styled.p`
  font-size: 14px;
  color: #777;
  margin: 0;
`;

const Review = styled.p`
  font-size: 14px;
  color: #333;
  margin: 5px 0;
`;

const Rating = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
`;
