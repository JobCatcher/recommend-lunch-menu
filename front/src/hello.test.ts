import {test, expect, describe, it} from 'vitest';
import {getDistanceFromLatLonInKm} from './utils/utils';

test('1 is 1', () => {
  expect(1).toBe(1);
});

test('1 is 1', () => {
  expect(1).not.toBe(3);
});

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
