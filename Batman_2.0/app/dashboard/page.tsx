export const dynamic = "force-dynamic";

import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await currentUser();

  // 🌟 THE CRITICAL FIX: Build-time Null Guard
  // This prevents Next.js from crashing during 'npm run build'
  if (!user) {
    return <div className="min-h-screen bg-black" />;
  }

  // 1. Get User Details from Metadata
  const userBranch = user?.publicMetadata?.branch as string;
  const userSemester = user?.publicMetadata?.semester as string;
  const userCycle = user?.publicMetadata?.cycle as string || "none";
  const isOnboarded = user?.publicMetadata?.onboardingComplete === true;

  // 🌟 SECURITY: Redirect if identity protocol isn't finished
  if (!isOnboarded) {
    redirect('/onboarding');
  }

  // 2. SMART FILTERING LOGIC
  let userNotes: any[] = [];
  
  try {
    if (userSemester) {
      if (userSemester === "1") {
        // 🌟 1st YEAR LOGIC: Filter by Semester and Cycle
        userNotes = await db.select().from(notes).where(
          and(
            eq(notes.semester, userSemester),
            eq(notes.cycle, userCycle) 
          )
        );
      } else {
        // 🌟 HIGHER SEM LOGIC: Match Branch and Semester
        userNotes = await db.select().from(notes).where(
          and(
            eq(notes.branch, userBranch),
            eq(notes.semester, userSemester)
          )
        );
      }
    }
  } catch (error) {
    console.error("Database Retrieval Error:", error);
  }

  // 3. Extract unique subject names for display
  const uniqueSubjects = Array.from(new Set(userNotes.map(note => note.subject)));

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative text-white">
      <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10 animate-card">
        
        {/* Dossier Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="text-[10px] font-bold text-gray-500 hover:text-red-500 uppercase tracking-[0.3em] transition-colors mb-4 inline-block"
          >
            &larr; back to home page
          </Link>
          <h1 className="text-4xl font-bold text-white tracking-tighter uppercase border-l-4 border-red-600 pl-6 shadow-sm">
            Your  <span className="text-red-600"> subjects</span>
          </h1>
          <p className="text-gray-500 mt-2 ml-8 font-bold uppercase tracking-[0.3em] text-[10px]">
             {userSemester === "1" ? `COMMON SECTOR // ${userCycle}` : `${userBranch} SECTOR // SEMESTER ${userSemester}`}
          </p>
        </div>

        {/* Subject Grid */}
        
        {uniqueSubjects.length === 0 ? (
             <div className="p-20 text-center bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10">
                <p className="text-gray-500 italic font-medium uppercase tracking-widest text-[10px]">
                    No notes or text book found // be a contributor to add notes for your subjects.
                </p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {uniqueSubjects.map((subjectName) => (
                <Link 
                  key={subjectName} 
                  href={`/subject/${encodeURIComponent(subjectName)}`} 
                  className="group relative"
                >
                  <div className="bg-black/40 backdrop-blur-xl h-52 p-8 rounded-3xl border border-white/10 flex flex-col justify-center items-center text-center transition-all duration-500 hover:border-red-600 hover:shadow-[0_0_40px_rgba(220,38,38,0.2)] group-hover:-translate-y-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-opacity mb-4">
                      Subject Module
                    </span>
                    <h3 className="font-bold text-white group-hover:text-red-500 transition-colors text-2xl tracking-tighter uppercase mb-4">
                      {subjectName}
                    </h3>
                    <div className="h-[2px] w-8 bg-white/10 group-hover:w-16 group-hover:bg-red-600 transition-all duration-500 mb-6"></div>
                    <div className="flex items-center gap-3 relative z-10 text-[10px] font-bold text-gray-500 group-hover:text-white uppercase tracking-[0.2em]">
                        click here &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}