'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce"; // We will simulate this if you don't have the package, see below*

export default function SearchBar() {
  const router = useRouter();
  const [text, setText] = useState("");
  // Simple debounce logic to avoid searching on every single keystroke immediately
  const [query] = useDebounce(text, 500); 

  useEffect(() => {
    if (!query) {
      router.push("/network");
    } else {
      router.push(`/network?search=${encodeURIComponent(query)}`);
    }
  }, [query, router]);

  return (
    <div className="mb-6">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search by Name or USN..." 
          className="w-full p-4 pl-12 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={(e) => setText(e.target.value)}
        />
        <span className="absolute left-4 top-4 text-gray-400">🔍</span>
      </div>
    </div>
  );
}

// *Note: If 'use-debounce' gives an error, run: npm install use-debounce
// OR: Just remove the debounce and use 'text' directly in useEffect (it will just be slightly faster/twitchier).