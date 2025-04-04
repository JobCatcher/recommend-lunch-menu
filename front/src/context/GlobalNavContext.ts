import {createContext} from 'react';

export type Menu = {
  drawLots: boolean;
  chatting: boolean;
};

const value: Menu = {
  drawLots: false,
  chatting: false,
};

export const GloablContext = createContext(value);
