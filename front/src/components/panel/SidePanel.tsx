import styled from '@emotion/styled';
import {IoIosCloseCircleOutline} from 'react-icons/io';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

const SidePanel = ({children, onClick}: Props) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <Container>
      <Div>
        <CloseButton onClick={handleClick} role="img" />
        {children}
      </Div>
    </Container>
  );
};

export default SidePanel;

const Container = styled.section`
  position: absolute;
  z-index: 1;
  display: flex;
  width: 700px;
  height: 800px;
  background: oklch(97% 0 0);
  border-radius: 8px;
`;

const Div = styled.div`
  width: 100%;
  position: relative;
`;

const CloseButton = styled(IoIosCloseCircleOutline)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  outline: none;
  cursor: pointer;
  border: none;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.2);
  }
  transition: all ease 300ms;
`;
