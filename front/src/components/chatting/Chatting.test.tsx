import {describe, expect, it} from 'vitest';
import {vi} from 'vitest';

import {render, screen} from '@testing-library/react';
import Chatting from './Chatting';

// isMobile을 모킹해서 모바일과 데스크탑 환경을 시뮬레이션
vi.mock('../utils/utils', () => ({
  isMobile: vi.fn(),
}));

describe('Home component', () => {
  it('renders the main title', () => {
    const mockSetState = vi.fn();
    render(<Chatting setState={mockSetState} />);

    const textElement = screen.getByText('채팅');
    expect(textElement).toBeInTheDocument();
  });
});
