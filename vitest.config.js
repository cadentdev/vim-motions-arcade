import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment (jsdom for browser-like environment)
    environment: 'jsdom',

    // Global test APIs (describe, it, expect, etc.)
    globals: true,

    // Only include unit tests (exclude E2E tests)
    include: ['tests/unit/**/*.test.js'],
    exclude: ['tests/e2e/**/*', 'node_modules/**/*'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '*.config.js',
        'src/**/*.test.js',
      ],
    },

    // Setup files
    // setupFiles: ['./tests/setup.js'],
  },
});
