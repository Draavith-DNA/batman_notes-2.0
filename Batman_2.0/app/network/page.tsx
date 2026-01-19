import { db } from "@/db";
import { users, followers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import Image from "next/image";
import { toggleFollow } from "@/app/actions";
import FollowButton from "./FollowButton"; // We will create this below

export default async function NetworkPage() {
  const { userId: myId } = await auth();
  
  // 1. Fetch all students from the DB
  const allUsers = await db.select().from(users);

  // 2. Fetch the list of people the current user follows 
  // (to decide if the button should say "Follow" or "Unfollow")
  const myFollows = myId 
    ? await db.select().from(followers).where(eq(followers.followerId, myId))
    : [];
  
  const followIds = new Set(myFollows.map(f => f.followingId));

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      
      {/* Background Reveal Animation */}
      <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 animate-card">
          <h1 className="text-4xl font-bold text-white tracking-tight border-l-4 border-red-600 pl-6">
            The Network
          </h1>
          <p className="text-gray-400 mt-2 ml-7">
            Connect with other heroes in the CSE department and beyond.
          </p>
        </div>

        {/* 🌟 THE USER GRID 🌟 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allUsers.filter(u => u.id !== myId).map((user) => (
            <div 
              key={user.id}
              className="animate-card bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-red-600/50 transition-all group shadow-xl"
            >
              <div className="flex items-start gap-4">
                {/* Profile Picture Placeholder (since we store name/email in DB) */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-black border-2 border-white/10 shrink-0 flex items-center justify-center text-white font-bold text-xl uppercase">
                  {user.name?.[0]}
                </div>

                <div className="flex-1 overflow-hidden">
                  <h3 className="text-white font-bold text-lg truncate">{user.name}</h3>
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest">
                    {user.branch} • Sem {user.semester}
                  </p>
                  
                  {/* 🌟 THE BIO 🌟 (Instagram Style) */}
                  <p className="text-gray-400 text-sm mt-3 line-clamp-2 italic leading-relaxed">
                    "{user.bio || "Protecting the campus in silence..."}"
                  </p>
                </div>
              </div>

              {/* Action Section */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-gray-600 uppercase tracking-tighter">
                  ID: {user.usn}
                </span>
                
                {/* We pass the initial follow state to a Client Component */}
                <FollowButton 
                  targetUserId={user.id} 
                  initialIsFollowing={followIds.has(user.id)} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* If no users found */}
        {allUsers.length <= 1 && (
          <div className="text-center py-20 bg-black/20 rounded-2xl border-2 border-dashed border-white/10">
            <p className="text-gray-500">The shadows are empty. No other heroes found yet.</p>
          </div>
        )}

      </main>
    </div>
  );
}