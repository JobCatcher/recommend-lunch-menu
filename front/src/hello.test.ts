import {test, expect} from 'vitest';

test('1 is 1', () => {
  expect(1).toBe(1);
});

test('1 + 1 is 2', () => {
  expect(2).not.toBe(3);
});
