import { db } from '@/db'; // Use '../db' or '../../db' if needed
import { notes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

// FIXED: 'params' is now a Promise in Next.js 15
export default async function SubjectPage({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  const user = await currentUser();
  
  // 1. We must "await" the params to get the name
  const { name } = await params;
  const subjectName = decodeURIComponent(name);
  
  const userBranch = user?.publicMetadata?.branch as string;
  const userSemester = user?.publicMetadata?.semester as string;

  // 2. Fetch notes for this subject
  const subjectNotes = await db.select().from(notes).where(
    and(
      eq(notes.branch, userBranch),
      eq(notes.semester, userSemester),
      eq(notes.subject, subjectName)
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-gray-500 hover:text-black mb-4 inline-block">&larr; Back to Dashboard</a>
          <h1 className="text-3xl font-bold text-gray-900">{subjectName}</h1>
          <p className="text-gray-500">{userBranch} • {userSemester} Sem</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {subjectNotes.length === 0 ? (
             <div className="p-8 text-center text-gray-500">
                No chapters added yet. Check back later!
             </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {subjectNotes.map((note) => (
                <a 
                  key={note.id} 
                  href={note.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 hover:bg-blue-50 transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      📄
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                        {note.title}
                      </h3>
                      <p className="text-xs text-gray-500 uppercase">{note.type}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-600">Open &rarr;</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}