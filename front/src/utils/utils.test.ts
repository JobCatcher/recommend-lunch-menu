import {describe, expect, it} from 'vitest';
import {getDistanceFromLatLonInKm, isMobile} from './utils';

describe('getDistanceFromLatLonInKm', () => {
  it('should return 0 if both points are the same', () => {
    const lat1 = 52.52;
    const lng1 = 13.405; // Coordinates of Berlin
    const lat2 = 52.52;
    const lng2 = 13.405;

    const distance = getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);
    expect(distance).toBe('0.00');
  });
});

describe('isMobile', () => {
  it('should return true if the user is on a mobile device', () => {
    // 모바일 환경을 흉내 내기 위해 navigator.userAgent를 모킹
    Object.defineProperty(window.navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Mobile/15E148',
    });

    expect(isMobile()).toBe(true);
  });

  it('should return false if the user is not on a mobile device', () => {
    // 데스크탑 환경을 흉내 내기 위해 navigator.userAgent를 모킹
    Object.defineProperty(window.navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    });

    expect(isMobile()).toBe(false);
  });
});
