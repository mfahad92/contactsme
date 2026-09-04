"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/search/SearchBar";
import TagsFilter from "@/components/tags/TagsFilter";
import ContactCard from "@/components/contact/ContactCard";
import EmptyState from "@/components/empty/EmptyState";

interface Tag {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts from API on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/contacts");
        if (!response.ok) throw new Error("Failed to fetch contacts");
        const data = await response.json();
        setContacts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Compute tags with counts
  const tagsWithCounts = useMemo(() => {
    const tagMap = new Map<string, number>();
    contacts.forEach((contact) => {
      contact.tags.forEach((tag) => {
        tagMap.set(tag.name, (tagMap.get(tag.name) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts]);

  // Filter contacts based on search, tag, and favorite
  const filteredContacts = useMemo(() => {
    let result = contacts;

    // Filter by favorites
    if (showFavoritesOnly) {
      result = result.filter((c) => favoriteIds.has(c.id));
    }

    // Filter by tag
    if (activeTag) {
      result = result.filter((c) =>
        c.tags.some((t) => t.name === activeTag)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.phone.replace(/^\+91/, "").includes(q.replace(/^\+?91/, "")) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    return result;
  }, [contacts, searchQuery, activeTag, showFavoritesOnly, favoriteIds]);

  const totalContacts = contacts.length;
  const favoriteCount = favoriteIds.size;

  const handleToggleFavorite = useCallback((contactId: string) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  }, []);

  const handleTagClick = useCallback((tagName: string | null) => {
    setActiveTag(tagName);
  }, []);

  const handleFavoritesToggle = useCallback(() => {
    setShowFavoritesOnly((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveTag(null);
    setShowFavoritesOnly(false);
    setSearchQuery("");
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        totalContacts={totalContacts}
        favoriteContacts={favoriteCount}
        tags={tagsWithCounts}
        activeTag={activeTag}
        isFavoritesView={showFavoritesOnly}
        onTagClick={(tag: string) => handleTagClick(tag)}
        onFavoritesToggle={handleFavoritesToggle}
        onClearFilters={handleClearFilters}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {showFavoritesOnly
                ? "Favorite Contacts"
                : activeTag
                ? `Tagged: ${activeTag}`
                : "All Contacts"}
            </h1>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search contacts..."
            />
          </header>

          {/* Tags filter */}
          {tagsWithCounts.length > 0 && (
            <div className="mb-6">
              <TagsFilter
                tags={tagsWithCounts}
                activeTag={activeTag}
                onTagClick={handleTagClick}
              />
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12 text-gray-500">Loading contacts...</div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12 text-red-500">Error: {error}</div>
          )}

          {/* Empty states */}
          {!isLoading && !error && contacts.length === 0 && (
            <EmptyState type="no-contacts" />
          )}

          {!isLoading && !error && contacts.length > 0 && filteredContacts.length === 0 && (
            <EmptyState type="no-results" query={searchQuery} onClear={handleClearFilters} />
          )}

          {/* Contact list */}
          {!isLoading && !error && filteredContacts.length > 0 && (
            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}