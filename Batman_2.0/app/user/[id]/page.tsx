export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, followers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import FollowButton from "../../network/FollowButton";
import { getFollowStats } from "@/app/actions";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { userId: myId } = await auth();
  
  // 🌟 THE CRITICAL FIX: Build-time Null Guard
  // Prevents the build process from crashing when no user session exists.
  if (!myId) {
    return <div className="min-h-screen bg-black" />;
  }

  const { id: targetId } = await params; 

  // 1. Fetch User Details
  const [user] = await db.select().from(users).where(eq(users.id, targetId));
  if (!user) return notFound();

  // 2. Fetch Follow Stats (Real-time numbers)
  const stats = await getFollowStats(targetId);

  // 3. Check if current logged-in user is following this profile
  const followCheck = await db
    .select()
    .from(followers)
    .where(and(eq(followers.followerId, myId), eq(followers.followingId, targetId)));
  
  const isFollowing = followCheck.length > 0;

  return (
    <div className="min-h-screen pt-24 px-6 relative">
       <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />
       
       <main className="max-w-4xl mx-auto relative z-10 animate-card">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-red-600 border-4 border-white/10 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                {user.name?.[0]}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-1">{user.name}</h1>
                    <p className="text-red-500 font-bold uppercase tracking-widest text-sm">
                      {user.branch} • Semester {user.semester}
                    </p>
                  </div>

                  {/* STATS DISPLAY */}
                  <div className="flex gap-6 text-white text-sm">
                    <div className="text-center">
                      <span className="font-bold block text-lg text-red-500">{stats.followerCount}</span>
                      <span className="text-gray-500 text-xs uppercase">followers</span>
                    </div>
                    <div className="text-center">
                      <span className="font-bold block text-lg text-red-500">{stats.followingCount}</span>
                      <span className="text-gray-500 text-xs uppercase">following</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 italic mb-6 leading-relaxed">
                  "{user.bio || "Protecting the campus in silence..."}"
                </p>
                
                {myId !== targetId && (
                  <div className="w-40">
                    <FollowButton 
                      targetUserId={user.id} 
                      initialIsFollowing={isFollowing} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
       </main>
    </div>
  );
}