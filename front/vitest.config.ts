import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // jsdom 환경 설정
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov', 'html'],
      reportsDirectory: './coverage',
      // thresholds: {},
    },
    globals: true,
    setupFiles: ['./setupTests.ts'],
  },
});
