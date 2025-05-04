import {Menu} from '../../context/GlobalNavContext';
import SidePanel from '../panel/SidePanel';

type Props = {
  setState: React.Dispatch<React.SetStateAction<Menu>>;
};

const Chatting = ({setState}: Props) => {
  const handleClick = () => {
    setState(prev => ({
      ...prev,
      chatting: !prev['chatting'],
    }));
  };

  return <SidePanel onClick={handleClick}>채팅</SidePanel>;
};

export default Chatting;
