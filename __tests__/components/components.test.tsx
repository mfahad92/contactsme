import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ContactCard from "@/components/contact/ContactCard"
import SearchBar from "@/components/search/SearchBar"
import TagsFilter from "@/components/tags/TagsFilter"
import EmptyState from "@/components/empty/EmptyState"
import Home from "@/app/page"

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

  it("toggles favorite state via parent control", () => {
    const onToggleFavorite = vi.fn()
    const { rerender } = render(
      <ContactCard contact={mockContact} onToggleFavorite={onToggleFavorite} />
    )

    const button = screen.getByTitle(/Add to favorites/)
    fireEvent.click(button)
    expect(onToggleFavorite).toHaveBeenCalledWith("1")

    rerender(
      <ContactCard
        contact={mockContact}
        onToggleFavorite={onToggleFavorite}
        isFavorite
      />
    )
    expect(screen.getByTitle(/Remove from favorites/)).toBeInTheDocument()
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

  it("calls onClear when clear button is clicked", () => {
    const onClear = vi.fn()
    render(<EmptyState type="no-results" query="test" onClear={onClear} />)

    const button = screen.getByText(/Clear Search & Filters/i)
    fireEvent.click(button)
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})

describe("SearchBar filtering", () => {
  it("filters contacts by name", async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} debounceMs={0} />)
    const input = screen.getByPlaceholderText("Search contacts...")
    fireEvent.change(input, { target: { value: "Alice" } })
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("Alice")
    })
  })

  it("filters contacts by phone number", async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} debounceMs={0} />)
    const input = screen.getByPlaceholderText("Search contacts...")
    fireEvent.change(input, { target: { value: "9876543210" } })
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("9876543210")
    })
  })

  it("filters contacts by email", async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} debounceMs={0} />)
    const input = screen.getByPlaceholderText("Search contacts...")
    fireEvent.change(input, { target: { value: "alice@example" } })
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("alice@example")
    })
  })
})

describe("TagsFilter behavior", () => {
  it("calls onTagClick when a tag is clicked", () => {
    const onTagClick = vi.fn()
    render(
      <TagsFilter
        tags={[{ name: "friends", count: 5 }]}
        activeTag={null}
        onTagClick={onTagClick}
      />
    )

    fireEvent.click(screen.getByText("friends"))
    expect(onTagClick).toHaveBeenCalledWith("friends")
  })

  it("shows active state for the selected tag", () => {
    render(
      <TagsFilter
        tags={[{ name: "work", count: 3 }]}
        activeTag="work"
        onTagClick={() => {}}
      />
    )

    expect(screen.getByText("work")).toBeInTheDocument()
  })
})