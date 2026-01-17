import { currentUser } from '@clerk/nextjs/server';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import OnboardingForm from './OnboardingForm';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';

export default async function Home() {
  const user = await currentUser();

  // 1. Get User Details
  const isOnboarded = user?.publicMetadata?.onboardingComplete === true;
  const userBranch = user?.publicMetadata?.branch as string;
  const userSemester = user?.publicMetadata?.semester as string;

  // 2. FETCH NOTES (Only if onboarded)
  let userNotes: any[] = [];
  if (isOnboarded && userBranch && userSemester) {
    userNotes = await db.select().from(notes).where(
      and(
        eq(notes.branch, userBranch),
        eq(notes.semester, userSemester)
      )
    );
  }

  // 3. Get Unique Subjects
  const uniqueSubjects = Array.from(new Set(userNotes.map(note => note.subject)));

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* NAV BAR */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Batman 2.0 🦇</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        
        <SignedOut>
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Campus Connect</h2>
            <SignInButton mode="modal">
              <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          {!isOnboarded ? (
             <OnboardingForm />
          ) : (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Your Subjects</h2>
                <p className="text-gray-500 mt-1">
                  {userBranch} • {userSemester} Semester
                </p>
              </div>

              {/* SUBJECT GRID */}
              {uniqueSubjects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">No content added for this semester yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Content is being updated by the admin.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {uniqueSubjects.map((subjectName) => (
                    <Link 
                      key={subjectName} 
                      href={`/subject/${encodeURIComponent(subjectName)}`}
                      className="block group"
                    >
                      <div className="bg-white h-40 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition flex flex-col justify-center items-center text-center cursor-pointer">
                        <span className="text-4xl mb-3">📚</span>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                          {subjectName}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </SignedIn>
      </main>
    </div>
  );
}