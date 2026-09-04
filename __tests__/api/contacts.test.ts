import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

// In-memory store simulating Prisma client behavior — hoisted for vi.mock factory
const { store, mockPrisma, makeCtx } = vi.hoisted(() => {
  const store = {
    contacts: new Map<string, any>(),
    tags: new Map<string, { id: string; name: string }>(),
  }
  let contactIdCounter = 0
  let tagIdCounter = 0

  const mockPrisma = {
    contact: {
      create: async ({ data }: any) => {
        const id = `contact-${++contactIdCounter}`
        const now = new Date()
        const resolvedTags = (data.tags?.connectOrCreate || []).map((t: any) => {
          if (!store.tags.has(t.where.name)) {
            const tagId = `tag-${++tagIdCounter}`
            store.tags.set(t.where.name, { id: tagId, name: t.where.name })
          }
          const tag = store.tags.get(t.where.name)!
          return { id: tag.id, name: tag.name }
        })
        const contact = {
          id,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email ?? null,
          notes: data.notes ?? null,
          createdAt: now,
          updatedAt: now,
          tags: resolvedTags,
        }
        store.contacts.set(id, contact)
        return contact
      },

      findMany: async ({ where, orderBy }: any) => {
        let results = Array.from(store.contacts.values())

        if (where?.OR) {
          results = results.filter((c) =>
            where.OR.some((cond: any) => {
              if (cond.firstName?.contains) {
                return c.firstName.toLowerCase().includes(cond.firstName.contains.toLowerCase())
              }
              if (cond.lastName?.contains) {
                return c.lastName.toLowerCase().includes(cond.lastName.contains.toLowerCase())
              }
              if (cond.phone?.contains) {
                return c.phone.includes(cond.phone.contains)
              }
              if (cond.email?.contains) {
                return c.email?.toLowerCase().includes(cond.email.contains.toLowerCase())
              }
              return false
            })
          )
        }

        if (where?.tags?.some?.name) {
          results = results.filter((c) =>
            c.tags.some((t: any) => t.name === where.tags.some.name)
          )
        }

        if (orderBy?.createdAt === "desc") {
          results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }

        return results
      },

      findUnique: async ({ where }: any) => {
        if (where.id) return store.contacts.get(where.id) ?? null
        if (where.phone) {
          return Array.from(store.contacts.values()).find((c) => c.phone === where.phone) ?? null
        }
        return null
      },

      update: async ({ where, data }: any) => {
        const existing = store.contacts.get(where.id)
        if (!existing) {
          const err: any = new Error("Record not found")
          err.code = "P2025"
          throw err
        }

        if (data.tags) {
          const resolvedTags = (data.tags.connectOrCreate || []).map((t: any) => {
            if (!store.tags.has(t.where.name)) {
              const tagId = `tag-${++tagIdCounter}`
              store.tags.set(t.where.name, { id: tagId, name: t.where.name })
            }
            const tag = store.tags.get(t.where.name)!
            return { id: tag.id, name: tag.name }
          })
          existing.tags = resolvedTags
        }

        Object.assign(existing, {
          firstName: data.firstName ?? existing.firstName,
          lastName: data.lastName ?? existing.lastName,
          phone: data.phone ?? existing.phone,
          email: data.email ?? existing.email,
          notes: data.notes ?? existing.notes,
          updatedAt: new Date(),
        })

        return existing
      },

      delete: async ({ where }: any) => {
        const existing = store.contacts.get(where.id)
        if (!existing) {
          const err: any = new Error("Record not found")
          err.code = "P2025"
          throw err
        }
        store.contacts.delete(where.id)
        return existing
      },
    },
  }

  const makeCtx = (id: string) => ({ params: { id } })

  return { store, mockPrisma, makeCtx }
})

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}))

// Mock NextResponse to return a simple object
vi.mock("next/server", async () => {
  const actual = await vi.importActual<any>("next/server")
  return {
    ...actual,
    NextResponse: {
      json: (data: any, init?: any) => ({
        json: async () => data,
        status: init?.status || 200,
        ok: true,
      }),
    },
  }
})

// Import routes AFTER mocks are set up
import { POST, GET } from "@/app/api/v1/contacts/route"
import { GET as GETSingle, PUT, DELETE } from "@/app/api/v1/contacts/[id]/route"

function makeRequest(url: string, init?: any): NextRequest {
  return new NextRequest(url, init)
}

describe("Contact CRUD API", () => {
  beforeEach(() => {
    store.contacts.clear()
    store.tags.clear()
  })

  describe("POST /api/v1/contacts", () => {
    it("creates a contact with valid data and returns 201", async () => {
      const body = {
        firstName: "Aarav",
        lastName: "Sharma",
        phone: "+919820155432",
        email: "aarav.sharma@example.in",
        tags: ["friends", "work"],
      }

      const response = await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify(body),
      })) as any

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.firstName).toBe("Aarav")
      expect(data.lastName).toBe("Sharma")
      expect(data.phone).toBe("+919820155432")
      expect(Array.isArray(data.tags)).toBe(true)
      expect(data.tags.length).toBe(2)
    })

    it("rejects invalid phone format with 400", async () => {
      const body = {
        firstName: "Aarav",
        lastName: "Sharma",
        phone: "+14155552671", // US number, should be rejected
      }

      const response = await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify(body),
      })) as any

      expect(response.status).toBe(400)
    })

    it("rejects missing required fields with 400", async () => {
      const body = {
        firstName: "",
        lastName: "",
        phone: "+919820155432",
      }

      const response = await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify(body),
      })) as any

      expect(response.status).toBe(400)
    })

    it("creates contacts with tags via connectOrCreate", async () => {
      const body = {
        firstName: "Priya",
        lastName: "Singh",
        phone: "+919876543211",
        tags: ["family"],
      }

      const response = await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify(body),
      })) as any

      const data = await response.json()
      expect(data.tags.length).toBe(1)
      expect(data.tags[0].name).toBe("family")
    })
  })

  describe("GET /api/v1/contacts", () => {
    it("lists all contacts", async () => {
      // Seed with a contact
      await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify({
          firstName: "List",
          lastName: "User",
          phone: "+919820155433",
        }),
      })) as any

      const response = await GET(makeRequest("http://localhost/api/v1/contacts")) as any

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })

    it("searches contacts by query parameter q", async () => {
      // Create a contact with searchable name
      await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify({
          firstName: "Searchable",
          lastName: "Contact",
          phone: "+919820155434",
        }),
      })) as any

      const response = await GET(makeRequest("http://localhost/api/v1/contacts?q=Searchable")) as any

      expect(response.status).toBe(200)
      const data = await response.json()
      const found = data.some((c: any) => c.firstName === "Searchable")
      expect(found).toBe(true)
    })

    it("filters contacts by tag", async () => {
      await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify({
          firstName: "Tagged",
          lastName: "Contact",
          phone: "+919820155435",
          tags: ["important"],
        }),
      })) as any

      const response = await GET(makeRequest("http://localhost/api/v1/contacts?tag=important")) as any

      expect(response.status).toBe(200)
      const data = await response.json()
      const found = data.some((c: any) => c.tags.some((t: any) => t.name === "important"))
      expect(found).toBe(true)
    })
  })

  describe("GET /api/v1/contacts/[id]", () => {
    it("returns a contact when found", async () => {
      const postResponse = await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify({
          firstName: "Single",
          lastName: "Contact",
          phone: "+919820155436",
        }),
      })) as any

      const postData = await postResponse.json()

      const response = await GETSingle(
        makeRequest(`http://localhost/api/v1/contacts/${postData.id}`),
        makeCtx(postData.id)
      ) as any

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.firstName).toBe("Single")
    })

    it("returns 404 when contact not found", async () => {
      const response = await GETSingle(
        makeRequest("http://localhost/api/v1/contacts/nonexistent-id"),
        makeCtx("nonexistent-id")
      ) as any

      expect(response.status).toBe(404)
    })
  })

  describe("PUT /api/v1/contacts/[id]", () => {
    it("updates a contact when found", async () => {
      const postResponse = await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify({
          firstName: "Updatable",
          lastName: "Contact",
          phone: "+919820155437",
        }),
      })) as any

      const postData = await postResponse.json()

      const response = await PUT(
        makeRequest(`http://localhost/api/v1/contacts/${postData.id}`, {
          method: "PUT",
          body: JSON.stringify({
            firstName: "Updated",
            phone: "+919820155437",
          }),
        }),
        makeCtx(postData.id)
      ) as any

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.firstName).toBe("Updated")
    })

    it("validates phone on update and rejects invalid format", async () => {
      const postResponse = await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify({
          firstName: "Phone",
          lastName: "Update",
          phone: "+919820155438",
        }),
      })) as any

      const postData = await postResponse.json()

      const response = await PUT(
        makeRequest(`http://localhost/api/v1/contacts/${postData.id}`, {
          method: "PUT",
          body: JSON.stringify({
            phone: "+14155552671", // Invalid, should be rejected
          }),
        }),
        makeCtx(postData.id)
      ) as any

      expect(response.status).toBe(400)
    })

    it("returns 404 when contact not found", async () => {
      const response = await PUT(
        makeRequest("http://localhost/api/v1/contacts/nonexistent-id", {
          method: "PUT",
          body: JSON.stringify({ firstName: "Ghost" }),
        }),
        makeCtx("nonexistent-id")
      ) as any

      expect(response.status).toBe(404)
    })
  })

  describe("DELETE /api/v1/contacts/[id]", () => {
    it("deletes a contact when found", async () => {
      const postResponse = await POST(makeRequest("http://localhost/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify({
          firstName: "ToBeDeleted",
          lastName: "Contact",
          phone: "+919820155439",
        }),
      })) as any

      const postData = await postResponse.json()

      const response = await DELETE(
        makeRequest(`http://localhost/api/v1/contacts/${postData.id}`),
        makeCtx(postData.id)
      ) as any

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it("returns 404 when contact not found", async () => {
      const response = await DELETE(
        makeRequest("http://localhost/api/v1/contacts/nonexistent-id"),
        makeCtx("nonexistent-id")
      ) as any

      expect(response.status).toBe(404)
    })
  })
})
