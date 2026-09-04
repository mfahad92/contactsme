import { describe, it, expect, vi } from "vitest"
import { GET } from "../app/api/health/route"

// Mock NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: any, init?: any) => {
      return {
        json: async () => data,
        status: init?.status || 200,
        ok: true,
      }
    },
  },
}))

describe("Health endpoint (unit)", () => {
  it("returns status ok via route handler", async () => {
    const response = await GET()
    const body = await response.json()
    expect(body).toEqual({ status: "ok" })
  })

  it("returns 200 status code", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
  })
})