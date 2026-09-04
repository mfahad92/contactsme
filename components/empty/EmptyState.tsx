interface EmptyStateProps {
  type: "no-contacts" | "no-results";
  query?: string;
}

export default function EmptyState({ type, query }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-300 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {type === "no-contacts" ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3m0 0l3-3m-3 3v6m0-6H8a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1H8z"
            />
          )}
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {type === "no-contacts"
          ? "No contacts yet"
          : "No contacts found"}
      </h2>
      <p className="text-gray-600 mb-6">
        {type === "no-contacts"
          ? "Add your first contact to get started."
          : `No contacts match "${query}". Try a different search or clear filters.`}
      </p>
      {type === "no-results" && (
        <button
          onClick={() => {
            // This would clear search and filters in a real implementation
            alert("Clear search and filters functionality would go here");
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Clear Search & Filters
        </button>
      )}
      {type === "no-contacts" && (
        <button
          onClick={() => alert("Add contact functionality would navigate to new contact form")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Add First Contact
        </button>
      )}
    </div>
  );
}