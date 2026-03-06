import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['**/*.test.js', '**/*.test.ts', '**/*.spec.js', '**/*.spec.ts'],
  },
})
