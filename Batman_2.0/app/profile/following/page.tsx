import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, followers } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import FollowButton from "../../network/FollowButton";

export default async function FollowingPage() {
  const { userId } = await auth();
  if (!userId) return <div className="text-white p-10 font-bold tracking-widest uppercase text-center">Access Denied: Sign-in Required</div>;

  // 1. Get everyone the current user is following using an Inner Join
  const myFollowingList = await db
    .select({ user: users })
    .from(followers)
    .where(eq(followers.followerId, userId))
    .innerJoin(users, eq(followers.followingId, users.id));

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      {/* Cinematic Background Reveal */}
      <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />

      <main className="max-w-3xl mx-auto relative z-10 animate-card">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          
          {/* Header Banner - Now with Red Gradient */}
          <div className="h-32 bg-gradient-to-r from-red-950/40 via-black to-black relative border-b border-white/5">
            <Link 
              href="/profile" 
              className="absolute top-6 left-6 text-white font-bold bg-black/40 hover:bg-red-600 px-4 py-2 rounded-full backdrop-blur-md transition-all text-xs border border-white/10 uppercase tracking-widest shadow-lg"
            >
              ← Back to Profile
            </Link>
          </div>

          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tighter border-l-4 border-red-600 pl-4 uppercase">
                  Following
                </h1>
                <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-red-500/20">
                  {myFollowingList.length} Connections
                </span>
            </div>

            {myFollowingList.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-gray-500 italic font-medium">Your circle is empty. Explore the network to find allies.</p>
                <Link href="/network" className="mt-4 inline-block text-red-600 text-xs font-bold uppercase tracking-widest hover:underline">
                  Go to Network →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {myFollowingList.map(({ user }) => (
                  <div 
                    key={user.id} 
                    className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all group"
                  >
                    {/* User Info Link */}
                    <Link href={`/user/${user.id}`} className="flex items-center gap-4 flex-1">
                      {/* Avatar with Red Glow */}
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-bold text-white text-lg border border-white/10 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/30">
                        {user.name?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-red-500 transition text-sm md:text-base">
                          {user.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {user.branch} • Sem {user.semester}
                        </p>
                      </div>
                    </Link>

                    {/* Action Button */}
                    <div className="w-32">
                      <FollowButton 
                        targetUserId={user.id} 
                        initialIsFollowing={true} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}