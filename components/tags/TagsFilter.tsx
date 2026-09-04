"use client";

import { useState } from "react";

interface Tag {
  name: string;
  count: number;
}

interface TagsFilterProps {
  tags: Tag[];
  activeTag: string | null;
  onTagClick: (tag: string | null) => void;
}

export default function TagsFilter({
  tags,
  activeTag,
  onTagClick,
}: TagsFilterProps) {
  const handleTagClick = (tagName: string) => {
    if (activeTag === tagName) {
      // Deselect if clicking the same tag
      onTagClick(null);
    } else {
      onTagClick(tagName);
    }
  };

  const handleClear = () => {
    onTagClick(null);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No tags available</p>
      ) : (
        <>
          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => handleTagClick(tag.name)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeTag === tag.name
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag.name}
              <span className="ml-1 text-xs opacity-75">({tag.count})</span>
            </button>
          ))}
          {activeTag && (
            <button
              onClick={handleClear}
              className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              Clear
            </button>
          )}
        </>
      )}
    </div>
  );
}