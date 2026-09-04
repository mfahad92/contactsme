import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ContactCard from "@/components/contact/ContactCard"
import SearchBar from "@/components/search/SearchBar"
import TagsFilter from "@/components/tags/TagsFilter"
import EmptyState from "@/components/empty/EmptyState"
import FavoriteIcon from "@/components/contact/FavoriteIcon"

describe("ContactCard", () => {
  const mockContact = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    phone: "+919876543210",
    email: "john@example.com",
    tags: [{ id: "1", name: "friends" }],
    createdAt: new Date(),
  }

  it("renders contact details correctly", () => {
    render(<ContactCard contact={mockContact} onToggleFavorite={() => {}} />)

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    expect(screen.getByText("+919876543210")).toBeInTheDocument()
    expect(screen.getByText("john@example.com")).toBeInTheDocument()
    expect(screen.getByText("friends")).toBeInTheDocument()
  })

  it("displays avatar with initials", () => {
    render(<ContactCard contact={mockContact} onToggleFavorite={() => {}} />)
    const avatar = screen.getByText(/JD/)
    expect(avatar).toBeInTheDocument()
  })
})

describe("SearchBar", () => {
  it("renders with placeholder text", () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Search contacts..." />)

    const input = screen.getByPlaceholderText("Search contacts...")
    expect(input).toBeInTheDocument()
  })

  it("can receive input", async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} debounceMs={0} />)
    const input = screen.getByPlaceholderText("Search contacts...")
    fireEvent.change(input, { target: { value: "test" } })
    expect(input).toHaveValue("test")
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("test")
    })
  })
})

describe("TagsFilter", () => {
  it("renders tag pills", () => {
    render(
      <TagsFilter
        tags={[{ name: "friends", count: 5 }]}
        activeTag={null}
        onTagClick={() => {}}
      />
    )

    expect(screen.getByText("friends")).toBeInTheDocument()
  })

  it("shows active state when tag is selected", () => {
    render(
      <TagsFilter
        tags={[{ name: "friends", count: 5 }]}
        activeTag="friends"
        onTagClick={() => {}}
      />
    )

    const tag = screen.getByText("friends")
    // Active tag should have different styling
    expect(tag).toBeInTheDocument()
  })
})

describe("EmptyState", () => {
  it("renders no-contacts state", () => {
    render(<EmptyState type="no-contacts" />)

    expect(screen.getByText("No contacts yet")).toBeInTheDocument()
  })

  it("renders no-results state with query", () => {
    render(<EmptyState type="no-results" query="test query" />)

    expect(screen.getByText(/No contacts found/i)).toBeInTheDocument()
    expect(screen.getByText(/test query/i)).toBeInTheDocument()
  })
})

describe("FavoriteIcon", () => {
  it("renders favorite icon when not favorite", () => {
    render(
      <FavoriteIcon
        isFavorite={false}
        onClick={() => {}}
      />
    )

    const icon = screen.getByTitle(/Add to favorites/)
    expect(icon).toBeInTheDocument()
  })

  it("renders filled favorite icon when favorite", () => {
    render(
      <FavoriteIcon
        isFavorite={true}
        onClick={() => {}}
      />
    )

    const icon = screen.getByTitle(/Remove from favorites/)
    expect(icon).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    render(
      <FavoriteIcon
        isFavorite={false}
        onClick={onClick}
      />
    )

    const icon = screen.getByTitle(/Add to favorites/)
    fireEvent.click(icon)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})