// Setup file for vitest tests
import "@testing-library/jest-dom"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
}))