import styled from '@emotion/styled';
import {Menu} from '../../context/GlobalNavContext';
import SidePanel from '../panel/SidePanel';
import useDrawLots from '../../hooks/useDrawLots';
import {useEffect, useRef} from 'react';

type Props = {
  setState: React.Dispatch<React.SetStateAction<Menu>>;
};

const DrawLots = ({setState}: Props) => {
  const draw = useDrawLots();
  const canvasRef = draw?.canvasRef;
  const rotate = draw?.rotate;
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    setState(prev => ({
      ...prev,
      drawLots: !prev['drawLots'],
    }));
  };

  const handleClickRotate = () => {
    if (buttonRef.current?.disabled) return;

    buttonRef.current!.disabled = true;
    rotate && rotate(buttonRef.current!);
  };

  useEffect(() => {
    draw?.makeLots && draw.makeLots();
  });

  return (
    <SidePanel onClick={handleClick}>
      <Div>
        <H2>오늘의 점심 뽑기</H2>
        <Canvas ref={canvasRef} />
        <DrawButton onClick={handleClickRotate} ref={buttonRef}>
          원판 돌리기
        </DrawButton>
      </Div>
    </SidePanel>
  );
};

export default DrawLots;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const DrawButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  outline: none;
  border: none;
  background: #cd4221ff;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 80px;
`;
