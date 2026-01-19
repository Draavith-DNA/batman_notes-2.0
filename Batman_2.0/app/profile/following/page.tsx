import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, followers } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import Link from "next/link";
import FollowButton from "../../network/FollowButton";

export default async function FollowingPage() {
  const { userId } = await auth();
  if (!userId) return <div>Sign in required</div>;

  // 1. Find who I follow
  const myFollowing = await db.select().from(followers).where(eq(followers.followerId, userId));
  
  // 2. Get their User Details
  let followingProfiles: typeof users.$inferSelect[] = [];
  if (myFollowing.length > 0) {
    const followingIds = myFollowing.map(f => f.followingId);
    followingProfiles = await db.select().from(users).where(inArray(users.id, followingIds));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <Link href="/profile" className="absolute top-6 left-6 text-white font-bold bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm transition text-sm">
                ← Back to Profile
            </Link>
        </div>

        <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Following</h1>

            {followingProfiles.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-gray-500 mb-2">You are not following anyone yet.</p>
                    <Link href="/network" className="text-blue-600 font-bold hover:underline">
                        Find people to connect with
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {followingProfiles.map(student => (
                        <div key={student.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                            
                            {/* 🌟 CLICKABLE USER INFO 🌟 */}
                            <Link href={`/user/${student.id}`} className="flex items-center gap-4 group cursor-pointer flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-lg border border-gray-200 group-hover:border-blue-300 transition">
                                    {student.name?.[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{student.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{student.branch} • {student.semester} Sem</p>
                                </div>
                            </Link>
                            
                            {/* Button */}
                            <div className="w-28">
                                <FollowButton 
                                    targetUserId={student.id} 
                                    initialIsFollowing={true} 
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