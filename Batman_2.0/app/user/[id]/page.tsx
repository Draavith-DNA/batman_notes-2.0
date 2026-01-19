import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, followers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import FollowButton from "../../network/FollowButton";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { userId: myId } = await auth();
  const { id: targetId } = await params; // 🌟 Await the params

  const [user] = await db.select().from(users).where(eq(users.id, targetId));
  if (!user) return notFound();

  const followCheck = myId ? await db.select().from(followers).where(
    and(eq(followers.followerId, myId), eq(followers.followingId, targetId))
  ) : [];
  
  const isFollowing = followCheck.length > 0;

  return (
    <div className="min-h-screen pt-24 px-6 relative">
       <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />
       <main className="max-w-4xl mx-auto relative z-10 animate-card">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-red-600 border-4 border-white/10 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                {user.name?.[0]}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4">{user.branch} • Semester {user.semester}</p>
                <p className="text-gray-300 italic mb-6">"{user.bio || "Protecting the campus in silence..."}"</p>
                
                {myId && myId !== targetId && (
                  <FollowButton 
                    targetUserId={user.id} 
                    initialIsFollowing={isFollowing} // 🌟 FIXED PROP NAME
                  />
                )}
              </div>
            </div>
          </div>
       </main>
    </div>
  );
}