import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { CreateContactSchema } from "@/lib/validation/contact"

// POST /api/v1/contacts — create a new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateContactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { firstName, lastName, phone, email, notes, tags } = parsed.data

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        notes,
        tags: tags?.length
          ? {
              connectOrCreate: tags.map(name => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /api/v1/contacts — list with optional search (q) and tag filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q")?.trim()
    const tag = searchParams.get("tag")?.trim()

    const where: any = {}

    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
        { email: { contains: q, mode: "insensitive" } },
      ]
    }

    if (tag) {
      where.tags = { some: { name: tag } }
    }

    const contacts = await prisma.contact.findMany({
      where,
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(contacts, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
