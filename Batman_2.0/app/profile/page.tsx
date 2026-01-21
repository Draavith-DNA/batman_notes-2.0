// 🌟 FIX 1: Explicitly force the page to be dynamic
export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { userBadges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFollowStats } from "../actions";
import BioEditor from "./BioEditor";
import Link from "next/link";
import BadgeGallery from "./BadgeGallery";

export default async function ProfilePage() {
  // Fetch current user session
  const user = await currentUser();

  // 🌟 FIX 2: THE BUILD-TIME GUARD
  // During 'npm run build', user will be null. 
  // This return statement prevents the code below (which needs user.id) from crashing.
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const metadata = user.publicMetadata;
  const userUsn = (metadata.usn as string) || "UNKNOWN";
  
  // Database queries now have a guaranteed USN/ID
  const assets = await db
    .select()
    .from(userBadges)
    .where(eq(userBadges.userUsn, userUsn.toUpperCase()));

  const { followerCount, followingCount } = await getFollowStats(user.id);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative text-white">
      <div className="fixed inset-0 z-0 bg-black/60 pointer-events-none" />

      <main className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-2 border-red-600 object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">
                {user.fullName || "AGENT_ID"}
              </h1>
              
              <p className="text-gray-500 font-mono text-sm tracking-widest uppercase mb-6">
                {userUsn} // {metadata.branch as string} // SEM {metadata.semester as string}
              </p>

              <div className="flex justify-center md:justify-start gap-12 border-t border-white/5 pt-6">
                <Link href="/profile/followers" className="text-center group">
                  <p className="text-2xl font-black text-white group-hover:text-red-600 transition-colors">{followerCount}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-gray-300">Followers</p>
                </Link>
                <Link href="/profile/following" className="text-center group">
                  <p className="text-2xl font-black text-white group-hover:text-red-600 transition-colors">{followingCount}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-gray-300">Following</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Content Block */}
        <div className="bg-black/40 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            
            <div className="flex-1">
              <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-6">Intelligence Dossier</h3>
              <BioEditor initialBio={metadata.bio as string || "No additional intelligence provided."} />
            </div>

            {/* 🌟 NEW INTERACTIVE GALLERY 🌟 */}
            {assets.length > 0 && <BadgeGallery assets={assets} />}

          </div>
        </div>
      </main>
    </div>
  );
}