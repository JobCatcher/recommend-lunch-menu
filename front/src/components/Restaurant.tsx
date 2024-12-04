import styled from '@emotion/styled';
import {RestaurantInfo} from '../types/restaurant';
import {navigateToRestaurant} from '../utils/utils';
import {useAtom, useAtomValue} from 'jotai';
import {clickedRestaurantAtom, restaurantsAtom} from '../stores/restaurantAtom';
import {mapAtom} from '../stores/mapAtom';

const Restaurant = ({id, title, category, reviewCount, rating, thumbnails, latitude, longitude}: RestaurantInfo) => {
  const [activeRestaurant, setActiveRestaurant] = useAtom(clickedRestaurantAtom);
  const map = useAtomValue(mapAtom);

  const handleClickRestaurant = () => {
    const {activeRestaurantId} = activeRestaurant;
    if (activeRestaurantId && activeRestaurantId === id) {
      navigateToRestaurant(title);

      return;
    }

    setActiveRestaurant({activeRestaurantId: id});
    map!.panTo(new window.kakao.maps.LatLng(latitude, longitude));
  };

  return (
    <RestaurantContainer onClick={handleClickRestaurant}>
      <ImageContainer>
        {thumbnails.map((image, idx) => {
          return (
            <img key={`${title}-${idx}`} src={image || 'https://via.placeholder.com/150'} alt={`${title} 이미지`} />
          );
        })}
      </ImageContainer>
      <InfoContainer>
        <Title>{title}</Title>
        <Category>{category}</Category>
        {/* <Description>흑돼지요리사맛집</Description> */}
        <Review>리뷰: {reviewCount}</Review>
        <Rating>별점: {rating}</Rating>
      </InfoContainer>
    </RestaurantContainer>
  );
};

export default Restaurant;

const RestaurantContainer = styled.li`
  max-width: 320px;
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
  width: 100%;
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
