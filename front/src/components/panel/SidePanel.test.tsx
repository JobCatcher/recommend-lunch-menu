import {render, screen, fireEvent} from '@testing-library/react';
import SidePanel from './SidePanel';
import {describe, it, expect, vi} from 'vitest';

describe('SidePanel', () => {
  //   it('children을 렌더링한다', () => {
  //     render(
  //       <SidePanel onClick={() => {}}>
  //         <div>패널 안에 있는 내용</div>
  //       </SidePanel>,
  //     );

  //     expect(screen.getByText('패널 안에 있는 내용')).toBeInTheDocument();
  //   });

  it('닫기 버튼을 누르면 onClick 콜백이 호출된다', () => {
    const handleClick = vi.fn();

    render(
      <SidePanel onClick={handleClick}>
        <div>내용</div>
      </SidePanel>,
    );

    const closeButton = screen.getByRole('img', {hidden: true}); // react-icons는 <svg role="img">로 나옴

    fireEvent.click(closeButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
