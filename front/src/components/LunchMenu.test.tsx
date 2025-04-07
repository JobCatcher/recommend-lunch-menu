import {describe, vi} from 'vitest';

vi.mock('jotai', () => ({
  useAtomValue: vi.fn(),
}));

describe('LunchMenu Component', () => {
  // it('추천메뉴가 없을 때 "추천메뉴가 없습니다.." 문구를 보여준다', () => {
  //   (useAtomValue as vi.Mock).mockReturnValue({restaurants: []});
  //   render(<LunchMenu />);
  //   expect(screen.getByText('추천메뉴가 없습니다..🥲')).toBeInTheDocument();
  // });
  // it('추천메뉴가 있을 때, Restaurant 컴포넌트가 렌더링된다', () => {
  //   const mockRestaurants = [
  //     {title: '김밥천국', address: '서울시 강남구', rating: 4.5},
  //     {title: '햄버거킹', address: '서울시 서초구', rating: 4.3},
  //   ];
  //   (useAtomValue as vi.Mock).mockReturnValue({restaurants: mockRestaurants});
  //   render(<LunchMenu />);
  //   expect(screen.getByText('추천 메뉴')).toBeInTheDocument();
  //   expect(screen.getByText('김밥천국')).toBeInTheDocument();
  //   expect(screen.getByText('햄버거킹')).toBeInTheDocument();
  // });
});
