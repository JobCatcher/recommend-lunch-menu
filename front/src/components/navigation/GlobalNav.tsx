import styled from '@emotion/styled';
import {Menu} from '../../context/GlobalNavContext';

type Props = {
  setState: React.Dispatch<React.SetStateAction<Menu>>;
};

const menus = [
  {
    name: '뽑기',
    url: 'draw-lots',
  },
  {
    name: '채팅',
    url: 'chatting',
  },
];

const GlobalNav = ({setState}: Props) => {
  const handleClick = (e: React.MouseEvent) => {
    const value = e.currentTarget.getAttribute('value') as keyof Menu;

    setState(prev => {
      if (prev?.[value]) return {...prev, value: !prev[value]};
      return {...prev, drawLots: !prev['drawLots']};
    });
  };

  return (
    <Ul>
      {menus.map(({name, url}) => (
        <Li key={url} value={url} onClick={handleClick}>
          {name}
        </Li>
      ))}
    </Ul>
  );
};

export default GlobalNav;

const Ul = styled.ul`
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  & :not(:last-child) {
    margin-right: 16px;
  }
`;

const Li = styled.li`
  cursor: pointer;
  font-weight: 600;
`;
