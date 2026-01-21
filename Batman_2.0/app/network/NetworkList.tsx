'use client';

import { useState } from 'react';
import Link from 'next/link';
import FollowButton from './FollowButton';

export default function NetworkList({ allUsers, followingIds }: { allUsers: any[], followingIds: string[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const followingSet = new Set(followingIds);

  // Filter users based on Name, Branch, or USN
  const filtered = allUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.usn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* 🔍 Search Bar */}
      <div className="max-w-md animate-card">
        <div className="relative group">
          <input 
            type="text"
            placeholder="Search by USN or name..."
            className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none transition-all shadow-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>

      {/* 🗂 User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((user) => (
          <div 
            key={user.id}
            className="animate-card bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-red-600/30 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl uppercase shrink-0 border-2 border-white/5 group-hover:scale-110 transition-transform">
                {user.name?.[0]}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg truncate">{user.name}</h3>
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{user.branch} • Sem {user.semester}</p>
                <p className="text-gray-400 text-sm mt-3 line-clamp-2 italic italic leading-relaxed">
                  "{user.bio || "Protecting the system in silence..."}"
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex gap-2">
              <Link 
                href={`/user/${user.id}`}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-3 rounded-lg text-center border border-white/10 transition uppercase tracking-widest"
              >
                View Profile
              </Link>
              <div className="flex-1">
                <FollowButton 
                  targetUserId={user.id} 
                  initialIsFollowing={followingSet.has(user.id)} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500 font-medium italic">
          No matches found in the Bat-computer database.
        </div>
      )}
    </div>
  );
}