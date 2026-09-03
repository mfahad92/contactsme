import { describe, it, expect } from "vitest"
import { CreateContactSchema } from "../lib/validation/contact"

describe("Contact validation", () => {
  it("validates valid Indian phone number +91XXXXXXXXXX", () => {
    const result = CreateContactSchema.safeParse({
      firstName: "Aarav",
      lastName: "Sharma",
      phone: "+919820155432",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid phone format", () => {
    const result = CreateContactSchema.safeParse({
      firstName: "Aarav",
      lastName: "Sharma",
      phone: "+14155552671",
    })
    expect(result.success).toBe(false)
  })

  it("rejects short phone number", () => {
    const result = CreateContactSchema.safeParse({
      firstName: "Aarav",
      lastName: "Sharma",
      phone: "9876",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing required fields", () => {
    const result = CreateContactSchema.safeParse({
      firstName: "",
      lastName: "",
      phone: "+919820155432",
    })
    expect(result.success).toBe(false)
  })

  it("validates correct email format", () => {
    const result = CreateContactSchema.safeParse({
      firstName: "Aarav",
      lastName: "Sharma",
      phone: "+919820155432",
      email: "aarav.sharma@example.in",
    })
    expect(result.success).toBe(true)
  })
})