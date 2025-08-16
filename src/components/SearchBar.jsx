// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

// API call logic
const searchAPI = async (query) => {
  if (!query) return { users: [], posts: [] };
  const response = await api.get(`/search?q=${query}`);
  return response.data;
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Debounce the search query
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchAPI(debouncedQuery),
    enabled: !!debouncedQuery, // debouncedQuery ရှိမှသာ API ကို ခေါ်မယ်
  });

  const results = data || { users: [], posts: [] };

  // Outside click event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  return (
    <div className="relative" ref={searchRef}>
      <input
        type="text"
        placeholder="Search users or posts..."
        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsSearchOpen(true);
        }}
      />
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
          {isLoading && <p className="p-4 text-center text-gray-500">Searching...</p>}
          {!isLoading && query.length > 0 && results.users.length === 0 && results.posts.length === 0 && (
            <p className="p-4 text-center text-gray-500">No results found.</p>
          )}

          {results.users.length > 0 && (
            <div className="border-b p-2">
              <p className="text-gray-500 font-semibold text-sm mb-1">Users</p>
              {results.users.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user.username}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                  <span className="ml-2 font-medium text-gray-800">{user.username}</span>
                </Link>
              ))}
            </div>
          )}

          {results.posts.length > 0 && (
            <div className="p-2">
              <p className="text-gray-500 font-semibold text-sm mb-1">Posts</p>
              {results.posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/posts/${post._id}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <p className="text-sm text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">{post.text}</p>
                  <p className="text-xs text-gray-500">by {post.user.username}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
