import { currentUser } from '@clerk/nextjs/server';
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
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

  // 2. FETCH NOTES
  let userNotes: any[] = [];
  if (user && isOnboarded && userBranch && userSemester) {
    userNotes = await db.select().from(notes).where(
      and(
        eq(notes.branch, userBranch),
        eq(notes.semester, userSemester)
      )
    );
  }
  const uniqueSubjects = Array.from(new Set(userNotes.map(note => note.subject)));

  return (
    <>
      {/* =========================================================
          VIEW 1: SIGNED OUT (LOGIN) -> VIDEO FADE IN
      ========================================================= */}
      <SignedOut>
        <main className="fixed inset-0 h-screen w-screen overflow-hidden">
          
          {/* 🌟 1. THE FADE-IN OVERLAY (NEW) 🌟 
              This sits ON TOP of the video (z-30) and fades out.
              It makes the video look like it's fading in from black.
          */}
          <div className="absolute inset-0 bg-black z-30 animate-reveal pointer-events-none" />

          {/* 2. THE VIDEO */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/batman.mp4" type="video/mp4" />
          </video>

          {/* 3. DARK TINT (Permanent) */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

          {/* 4. CONTENT */}
          <div className="relative z-20 w-full h-full">
            <div 
              className="absolute top-1/2 -translate-y-1/2"
              style={{ right: '80px' }} 
            >
              <SignIn 
                routing="hash" 
                appearance={{
                  baseTheme: dark,
                  variables: { colorBackground: 'transparent', colorPrimary: '#dc2626' },
                  elements: {
                    rootBox: "w-full max-w-md",
                    card: "backdrop-blur-md border-2 border-red-600 p-8 rounded-2xl",
                    formFieldInput: "bg-black/60 border-white/20 text-white focus:border-red-600 focus:ring-red-600 focus:ring-1 transition-all rounded-lg py-3",
                    formButtonPrimary: "bg-white text-black font-extrabold text-lg py-3 uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all duration-300 border-none",
                    socialButtonsBlockButton: "bg-white/10 text-white hover:bg-white/20 border-white/10 transition-all",
                    headerTitle: "text-white text-3xl font-bold tracking-widest uppercase",
                    headerSubtitle: "text-gray-400",
                    formFieldLabel: "text-gray-300",
                    footerActionText: "text-gray-400",
                    footerActionLink: "text-red-500 hover:text-red-400 font-bold"
                  }
                }}
              />
              <style>{`
                .cl-card { background-color: rgba(0, 0, 0, 0.6) !important; box-shadow: 0 0 50px rgba(220, 38, 38, 0.6) !important; }
                .cl-formButtonPrimary:hover { box-shadow: 0 0 30px rgba(220, 38, 38, 0.8) !important; }
              `}</style>
            </div>
          </div>
        </main>
      </SignedOut>

      {/* =========================================================
          VIEW 2: SIGNED IN (DASHBOARD)
      ========================================================= */}
      <SignedIn>
        <div className="min-h-screen pt-10 relative">
          
          {/* DASHBOARD FADE IN */}
          <div className="fixed inset-0 z-0 animate-reveal bg-black" />

          <main className="max-w-5xl mx-auto p-6 relative z-10">
            {!isOnboarded ? (
              <OnboardingForm />
            ) : (
              <div>
                <div className="mb-8 mt-4 backdrop-blur-md bg-black/60 p-6 rounded-xl border border-red-600/30 shadow-lg animate-card">
                  <h1 className="text-3xl font-bold text-white">Study Material</h1>
                  <p className="text-gray-300 mt-1">{userBranch} • {userSemester} Semester</p>
                </div>
                
                {uniqueSubjects.length === 0 ? (
                  <div className="text-center py-16 bg-black/60 backdrop-blur-md rounded-xl border-2 border-dashed border-gray-600 animate-card">
                    <p className="text-gray-300 text-lg">No content added yet.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {uniqueSubjects.map((subjectName) => (
                      <Link key={subjectName} href={`/subject/${encodeURIComponent(subjectName)}`} className="block group animate-card">
                        <div className="bg-black/70 backdrop-blur-md h-40 p-6 rounded-xl border border-gray-700 shadow-xl hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:border-red-600 transition flex flex-col justify-center items-center text-center cursor-pointer">
                          <span className="text-4xl mb-3">📚</span>
                          <h3 className="text-xl font-bold text-white group-hover:text-red-500">{subjectName}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </SignedIn>
    </>
  );
}