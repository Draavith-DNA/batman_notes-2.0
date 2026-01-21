export const dynamic = "force-dynamic";
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function SubjectPage({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  const user = await currentUser();
  const { name } = await params;
  const subjectName = decodeURIComponent(name);
  
  // Get User Profile Metadata
  const userBranch = (user?.publicMetadata?.branch as string) || "";
  const userSemester = (user?.publicMetadata?.semester as string) || "";
  const userCycle = (user?.publicMetadata?.cycle as string) || "none";

  /**
   * 🌟 THE POWER QUERY
   * We filter by Subject and Semester (most stable).
   * We use 'or' for the cycle to catch "none" or the specific cycle.
   */
  const subjectNotes = await db.select().from(notes).where(
    and(
      eq(notes.subject, subjectName),
      eq(notes.semester, userSemester),
      // This allows general notes OR cycle-specific notes to appear
      or(
        eq(notes.cycle, userCycle),
        eq(notes.cycle, "none")
      )
    )
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10">
        
        {/* DEBUG PANEL: Remove this once notes appear */}
        <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-xl text-[10px] font-mono text-gray-400">
          <p>YOUR IN: [Subject: {subjectName}] [Branch: {userBranch}] [Sem: {userSemester}] [Cycle: {userCycle}]</p>
          <p>RESULTS_FOUND: {subjectNotes.length}</p>
        </div>

        {/* Navigation Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link 
              href="/" 
              className="text-[10px] font-bold text-gray-500 hover:text-red-500 uppercase tracking-[0.3em] transition-colors mb-4 inline-block"
            >
              &larr; back to home page
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase border-l-4 border-red-600 pl-6 shadow-sm">
              {subjectName}
            </h1>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black bg-white text-black px-3 py-1 rounded-full uppercase tracking-widest">
                SEM {userSemester}
             </span>
          </div>
        </div>

        {/* Content Container */}
        
        <div className="bg-black/40 backdrop-blur-xl rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
          {subjectNotes.length === 0 ? (
             <div className="p-24 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-600/10 mb-6 border border-red-600/20 flex items-center justify-center animate-pulse">
                    <span className="text-3xl text-red-600">📁</span>
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter mb-2">Archive Empty</h2>
                <p className="text-gray-500 italic text-sm max-w-xs mx-auto">
                  No intel found for <strong>{userCycle}</strong> in <strong>Semester {userSemester}</strong>.
                </p>
             </div>
          ) : (
            <div className="divide-y divide-white/5">
              {subjectNotes.map((note) => (
                <a 
                  key={note.id} 
                  href={note.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-8 hover:bg-red-600/5 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 bg-black/60 text-red-600 rounded-2xl border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:border-red-600/50 transition-colors">
                      {note.type === 'qp' ? '❓' : note.type === 'textbook' ? '📚' : '📄'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-red-500 transition-colors text-xl tracking-tight">
                        {note.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-tighter">
                            {note.type}
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                            {note.cycle !== 'none' ? note.cycle : 'General'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-600 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
                        CLICK TO ACCESS
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-red-600 transition-colors">
                        <span className="text-red-600 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* System Footer */}
        <div className="mt-12 border-t border-white/5 pt-6 text-center">
            <p className="text-[9px] text-gray-600 uppercase tracking-[0.5em] font-black">
                These Notes are sourced from fellow students. Verify authenticity before relying on them. // batmna-2.0
            </p>
        </div>
      </main>
    </div>
  );
}