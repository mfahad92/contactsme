import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
  totalContacts: number;
  favoriteContacts: number;
  tags: Array<{ name: string; count: number }>;
  activeTag: string | null;
  isFavoritesView: boolean;
  onTagClick: (tag: string) => void;
  onFavoritesToggle: () => void;
  onClearFilters: () => void;
}

export default function Sidebar({
  totalContacts,
  favoriteContacts,
  tags,
  activeTag,
  isFavoritesView,
  onTagClick,
  onFavoritesToggle,
  onClearFilters,
}: SidebarProps) {
  const router = useRouter();
  const [showAddContactToast, setShowAddContactToast] = useState(false);

  const handleAddContact = () => {
    // Add Contact form page (out of scope for this PR) — show non-blocking toast
    setShowAddContactToast(true);
    setTimeout(() => setShowAddContactToast(false), 3000);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        {/* Header */}
        <h2 className="text-xl font-bold mb-6">ContactsMe</h2>

        {/* Navigation */}
        <nav className="space-y-2 mb-6">
          {/* All Contacts */}
          <button
            onClick={() => {
              router.push("/");
              // Clear active filters when navigating to All Contacts
              onClearFilters();
            }}
            className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              !isFavoritesView && !activeTag
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Contacts
            <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              {totalContacts}
            </span>
          </button>

          {/* Favorites */}
          <button
            onClick={onFavoritesToggle}
            className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              isFavoritesView ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.36l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 13.18l-6.181-6.181z"
              />
            </svg>
            Favorites / Pinned
            <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              {favoriteContacts}
            </span>
          </button>
        </nav>

        {/* Tags Section */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="space-y-1">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => onTagClick(tag.name)}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTag === tag.name
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tag.name}
                  <span className="ml-auto px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full">
                    {tag.count}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No tags yet</p>
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        {(activeTag || isFavoritesView) && (
          <button
            onClick={onClearFilters}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Filters
          </button>
        )}

        {/* Add Contact Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleAddContact}
            className="w-full flex items-center justify-between px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <span>Add Contact</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m0-6H6"
              />
            </svg>
          </button>
        </div>

        {/* Add Contact feedback toast */}
        {showAddContactToast && (
          <div
            role="status"
            className="fixed bottom-4 left-4 bg-gray-800 text-white text-sm px-4 py-2 rounded-md shadow-lg z-50"
          >
            Add Contact form is not yet available.
          </div>
        )}
      </div>
    </aside>
  );
}