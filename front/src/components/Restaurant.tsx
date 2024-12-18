import styled from '@emotion/styled';
import {RestaurantInfo} from '../types/restaurant';
import {getDistanceFromLatLonInKm, triggerEvent} from '../utils/utils';
import {useAtom, useAtomValue} from 'jotai';
import {clickedRestaurantAtom, restaurantMarkersAtom} from '../stores/restaurantAtom';
import {mapAtom} from '../stores/mapAtom';

interface RestaurantProps {
  restaurant: RestaurantInfo;
  currentPosition?: {latitude: number; longitude: number};
}

const Restaurant = ({restaurant, currentPosition}: RestaurantProps) => {
  if (!restaurant) return;

  const {id, title, category, reviewCount, rating, thumbnails, latitude, longitude} = restaurant;
  const map = useAtomValue(mapAtom);
  const {markers} = useAtomValue(restaurantMarkersAtom);
  const [, setActiveRestaurant] = useAtom(clickedRestaurantAtom);

  const handleClickRestaurant = () => {
    const mapMarker = markers.get(id);
    triggerEvent('click', mapMarker); // 인포윈도우 띄우기

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
        <Title>{title} </Title>
        <Category>{category} </Category>
        {/* <Description>흑돼지요리사맛집</Description> */}
        <Review>
          리뷰: {reviewCount} / 별점: {rating}
        </Review>
        <Rating>
          {currentPosition ? (
            <span>
              거리:{' '}
              {getDistanceFromLatLonInKm(latitude, longitude, currentPosition.latitude, currentPosition.longitude)}
            </span>
          ) : (
            <></>
          )}
        </Rating>
      </InfoContainer>
    </RestaurantContainer>
  );
};

export default Restaurant;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px;
`;

const RestaurantContainer = styled.li`
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: #fafcff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
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
