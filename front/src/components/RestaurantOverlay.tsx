import styled from '@emotion/styled';
import {RestaurantInfo} from '../types/restaurant';
import Restaurant from './Restaurant';
import close from '../../public/close.png';

interface RestaurantOverlayProps {
  restaurant: RestaurantInfo;
  currentPosition: {latitude: number; longitude: number};
}

const RestaurantOverlay = ({restaurant, currentPosition}: RestaurantOverlayProps) => {
  return (
    // RestaurantOverlay 컴포넌트는 KakaoMap 내 RenderToString 함수를 통해 문자열로 변환되는데,
    // 이 때 스타일이 적용되지 않는 문제가 발생합니다.
    // 스타일이 적용되지 않는 이유는 emotion의 스타일링 방식 때문.
    // emotion은 컴포넌트와 함께 스타일 태그를 동적으로 생성.
    // 그러나 renderToString()으로 HTML을 변환할 경우, 해당 스타일 태그가 HTML 문자열에 포함되지 않으므로 Kakao Map에서는 스타일이 적용되지 않는다ㅠ
    // 이를 해결하는 방법으로 emotion 스타일 태그를 수동으로 삽입하는 법이 있다.
    // emotion에서 렌더링한 스타일 태그를 Kakao Map DOM 컨텍스트로 강제로 전달하는 것인데, emotion/cache와 emotion/server/create-instance 등을 사용하여 작업하여야 한다.
    // 이 정도의 공수를 들여야 할 필요는 없기에, inline으로 간다!
    <Wrapper>
      <Image src={close} style={{position: 'absolute', width: '32px', right: '0', cursor: 'pointer'}} alt="close" />
      <Restaurant restaurant={restaurant} currentPosition={currentPosition} />
    </Wrapper>
  );
};

export default RestaurantOverlay;

const Wrapper = styled.div`
  position: relative;
`;

const Image = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
`;
