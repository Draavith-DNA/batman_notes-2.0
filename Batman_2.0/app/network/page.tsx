import { db } from "@/db";
import { users, followers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import NetworkList from "./NetworkList";

export default async function NetworkPage() {
  const { userId: myId } = await auth();
  
  // 1. Fetch all students registered in your database
  const allUsers = await db.select().from(users);
  
  // 2. Fetch the list of people you already follow 
  // This ensures the buttons show "Unfollow" for people you already know
  const myFollows = myId 
    ? await db.select().from(followers).where(eq(followers.followerId, myId))
    : [];
  
  const followingIds = new Set(myFollows.map(f => f.followingId));

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      {/* Cinematic Background Reveal */}
      <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 animate-card">
          <h1 className="text-4xl font-bold text-white tracking-tighter border-l-4 border-red-600 pl-6 uppercase">
            The Network
          </h1>
          <p className="text-gray-400 mt-2 ml-7 font-medium">
            Get in touch with fellow students across branches and semesters.
          </p>
        </div>

        {/* 3. PASS DATA TO THE LIST COMPONENT
          We filter out 'myId' so you don't see yourself in the discovery list.
        */}
        <NetworkList 
          allUsers={allUsers.filter(u => u.id !== myId)} 
          followingIds={Array.from(followingIds)} 
        />
      </main>
    </div>
  );
}