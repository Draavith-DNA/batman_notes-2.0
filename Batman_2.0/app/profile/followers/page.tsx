import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, followers } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import Link from "next/link";
import FollowButton from "../../network/FollowButton";

export default async function FollowersPage() {
  const { userId } = await auth();
  if (!userId) return <div>Sign in required</div>;

  const myFollowers = await db.select().from(followers).where(eq(followers.followingId, userId));
  
  let followerProfiles: typeof users.$inferSelect[] = [];
  if (myFollowers.length > 0) {
    const followerIds = myFollowers.map(f => f.followerId);
    followerProfiles = await db.select().from(users).where(inArray(users.id, followerIds));
  }

  const peopleIFollow = await db.select().from(followers).where(eq(followers.followerId, userId));
  const myFollowingIds = new Set(peopleIFollow.map(f => f.followingId));

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10 bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 overflow-hidden animate-card">
        <div className="h-32 bg-gradient-to-r from-red-900 to-black relative">
            <Link href="/profile" className="absolute top-6 left-6 text-white font-bold bg-black/30 hover:bg-red-600 px-4 py-2 rounded-full backdrop-blur-sm transition text-sm border border-white/10">
                ← Back to Profile
            </Link>
        </div>

        <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4 uppercase tracking-tighter">Followers</h1>

            {followerProfiles.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500">No one is following you yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {followerProfiles.map(student => (
                        <div key={student.id} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                            <Link href={`/user/${student.id}`} className="flex items-center gap-4 group cursor-pointer flex-1">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-bold text-white text-lg border border-white/10 group-hover:scale-110 transition-transform">
                                    {student.name?.[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-red-500 transition">{student.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium">{student.branch} • {student.semester} Sem</p>
                                </div>
                            </Link>
                            <div className="w-28">
                                <FollowButton 
                                    targetUserId={student.id} 
                                    initialIsFollowing={myFollowingIds.has(student.id)} // 🌟 FIXED PROP NAME
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}