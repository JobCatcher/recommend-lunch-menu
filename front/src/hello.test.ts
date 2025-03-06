import {test, expect} from 'vitest';

test('1 is 1', () => {
  expect(1).toBe(1);
});

test('1 is 1', () => {
  expect(1).not.toBe(1);
});

test('1 + 1 is', () => {
  expect(2).not.toBe(1);
});

test('1 + 1 is', () => {
  expect(2).toBe(2);
});

test('1 + 3 is', () => {
  expect(4).not.toBe(2);
});

test('1 + 3 is', () => {
  expect(4).toBe(4);
});
