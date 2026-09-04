import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.test.tsx'],
    testTimeout: 10000,
    hookTimeout: 10000,
    env: {
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/contactsme?schema=public",
    },
    setupFiles: ['__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})