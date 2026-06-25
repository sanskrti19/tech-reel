"use client";

import { Search } from "lucide-react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="relative p-4">
      <Search
        size={20}
        className="
          absolute
          left-7
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        type="text"
        placeholder="Search React, Node, AI..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="
          w-full
          rounded-full
          bg-white/10
          backdrop-blur-md
          border border-white/10
          py-3
          pl-12
          pr-4
          text-white
          placeholder-gray-400
          outline-none
          focus:ring-2
          focus:ring-cyan-500
        "
      />
    </div>
  );
}