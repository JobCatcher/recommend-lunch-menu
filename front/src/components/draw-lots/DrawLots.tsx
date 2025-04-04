import styled from '@emotion/styled';
import {Menu} from '../../context/GlobalNavContext';
import SidePanel from '../panel/SidePanel';
import useDrawLots from '../../hooks/useDrawLots';
import {useEffect} from 'react';

type Props = {
  setState: React.Dispatch<React.SetStateAction<Menu>>;
};

const DrawLots = ({setState}: Props) => {
  const draw = useDrawLots();
  const canvasRef = draw?.canvasRef;
  const rotate = draw?.rotate;

  const handleClick = () => {
    setState(prev => ({
      ...prev,
      drawLots: !prev['drawLots'],
    }));
  };

  const handleClickRotate = () => {
    console.log('rr: ', rotate);
    rotate && rotate();
  };

  useEffect(() => {
    draw?.makeLots && draw.makeLots();
  });

  return (
    <SidePanel onClick={handleClick}>
      <Div>
        <H2>오늘의 점심 뽑기</H2>
        <Canvas ref={canvasRef} />
        <button onClick={handleClickRotate}>원판 돌리기</button>
      </Div>
    </SidePanel>
  );
};

export default DrawLots;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const H2 = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 40px;
`;

const Canvas = styled.canvas``;
