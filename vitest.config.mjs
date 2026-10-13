import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    // Pure domain/API suites stay in `node`. Component suites opt into a DOM
    // per-file with the `// @vitest-environment happy-dom` docblock pragma.
    environment: 'node',
    include: [
      'src/**/__tests__/**/*.test.ts',
      'src/**/__tests__/**/*.test.tsx',
      'src/**/*.test.ts',
    ],
  },
  // Vite 8 transforms with Rolldown/oxc (the legacy `esbuild` option is ignored).
  // tsconfig sets `jsx: preserve` for Next.js, so the test transform must be told
  // to emit real JSX calls instead of leaving JSX for a bundler.
  oxc: {
    jsx: {
      runtime: 'automatic',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/modules': path.resolve(__dirname, './src/modules'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/mocks': path.resolve(__dirname, './src/mocks'),
    },
  },
});
