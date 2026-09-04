import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UpdateContactSchema } from "@/lib/validation/contact"

// GET /api/v1/contacts/[id] — retrieve a single contact
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: { tags: true },
    })

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json(contact, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/v1/contacts/[id] — update a contact
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    const body = await request.json()
    const parsed = UpdateContactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Check contact exists
    const existing = await prisma.contact.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    const { firstName, lastName, phone, email, notes, tags } = parsed.data

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        firstName,
        lastName,
        phone,
        email,
        notes,
        tags: {
          set: [],
          connectOrCreate: tags?.length
            ? tags.map(name => ({
                where: { name },
                create: { name },
              }))
            : [],
        },
      },
      include: { tags: true },
    })

    return NextResponse.json(contact, { status: 200 })
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/contacts/[id] — delete a contact
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    // Check contact exists
    const existing = await prisma.contact.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    await prisma.contact.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
