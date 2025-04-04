import {describe, expect, it} from 'vitest';
import {vi} from 'vitest';
import Home from './Home';
import {render} from '@testing-library/react';
import {useContext, useState} from 'react';
import {GloablContext} from '../context/GlobalNavContext';

// isMobile을 모킹해서 모바일과 데스크탑 환경을 시뮬레이션
vi.mock('../utils/utils', () => ({
  isMobile: vi.fn(),
}));

describe('Home component', () => {
  it('renders the main title', () => {
    const globalContext = useContext(GloablContext);
    const [, setState] = useState(globalContext);
    const {container} = render(<Home setState={setState} />);
    const mainTitle = container.querySelector('h1');
    expect(mainTitle).not.toBeNull();
    expect(mainTitle?.textContent).toBe('오늘의 점심');
  });

  //   it('renders LunchMenu component', () => {
  //     const {container} = render(<Home />);
  //     const lunchMenu = container.querySelector('div[id="lunch-menu"]'); // LunchMenu 컴포넌트에 `id="lunch-menu"` 추가 필요
  //     expect(lunchMenu).not.toBeNull();
  //   });

  //   it('should set correct map container width and height for mobile', () => {
  //     // 모바일 환경 시
  //     isMobile.mockReturnValue(true);
  //     const {container} = render(<Home />);
  //     const mapDiv = container.querySelector('#map');
  //     expect(mapDiv).not.toBeNull();
  //     expect(mapDiv).toHaveStyle('width: 300px');
  //     expect(mapDiv).toHaveStyle('height: 400px');
  //   });

  //   it('should set correct map container width and height for desktop', () => {
  //     // 데스크탑 환경 시
  //     isMobile.mockReturnValue(false);
  //     const {container} = render(<Home />);
  //     const mapDiv = container.querySelector('#map');
  //     expect(mapDiv).not.toBeNull();
  //     expect(mapDiv).toHaveStyle('width: 1100px');
  //     expect(mapDiv).toHaveStyle('height: 800px');
  //   });
});
