"use client";

import { useState } from "react";

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
  tags: Tag[];
  createdAt: string | Date;
}

interface ContactCardProps {
  contact: Contact;
  onToggleFavorite: (contactId: string) => void;
}

function getAvatarColor(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

export default function ContactCard({
  contact,
  onToggleFavorite,
}: ContactCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase();
  const avatarColor = getAvatarColor(initials);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite(contact.id);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(contact.phone);
    alert("Phone number copied!");
  };

  const handleCardClick = () => {
    alert("Navigate to contact detail (placeholder)");
  };

  return (
    <div
      className="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {contact.firstName} {contact.lastName}
          </h3>

          {/* Phone */}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm text-blue-600">{contact.phone}</span>
            <button
              onClick={handleCopyPhone}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy phone number"
            >
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          {/* Email */}
          {contact.email && (
            <p className="text-sm text-gray-500 truncate mt-0.5">{contact.email}</p>
          )}

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {contact.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFavorite
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-gray-300 hover:text-gray-400"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}