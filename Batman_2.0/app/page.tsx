// 🌟 FIX 1: Ensure the landing page is dynamic to handle user metadata correctly
export const dynamic = "force-dynamic";

import { currentUser } from '@clerk/nextjs/server';
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import OnboardingForm from './OnboardingForm';
import Link from 'next/link';

export default async function Home() {
  const user = await currentUser();

  // 🌟 FIX 2: Enhanced Onboarding Check
  // We check if metadata exists and specifically if onboardingComplete is true.
  // If user is null (during build), this safely results in false.
  const isOnboarded = !!user?.publicMetadata?.onboardingComplete;

  return (
    <>
      {/* =========================================================
          VIEW 1: SIGNED OUT (LOGIN)
      ========================================================= */}
      <SignedOut>
        <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
          
          {/* Fade-in Overlay */}
          <div className="absolute inset-0 bg-black z-40 animate-reveal pointer-events-none" />

          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/batman.mp4" type="video/mp4" />
          </video>

          {/* Dark Tint Layer */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

          {/* Content Layer */}
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
          VIEW 2: SIGNED IN
      ========================================================= */}
      <SignedIn>
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
          
          <div className="fixed inset-0 z-0 animate-reveal bg-black/40 pointer-events-none" />

          <main className="relative z-10 w-full max-w-5xl px-6">
            {!isOnboarded ? (
              /* 🌟 FORCE ONBOARDING VIEW */
              <div className="bg-black/80 backdrop-blur-2xl p-10 rounded-[40px] border border-red-600/50 shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-reveal">
                <div className="text-center mb-8">
                  <h2 className="text-white text-2xl font-black uppercase tracking-widest italic">Identity Protocol</h2>
                  <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest font-bold">Complete verification to access the network</p>
                </div>
                <OnboardingForm />
              </div>
            ) : (
              /* 🌟 AUTHENTICATED ACCESS VIEW */
              <div className="flex flex-col items-center justify-center animate-card">
                <div className="animate-pulse duration-[5000ms] text-center mb-10">
                  <h2 className="text-[11px] md:text-[13px] font-black uppercase tracking-[1.2em] text-white/40">
                    System Active // Monitoring Sector
                  </h2>
                </div>
                
                {/* 🌟 NEXT STEP BUTTON: Ensures users aren't stuck on a blank screen */}
                <Link 
                  href="/dashboard" 
                  className="px-10 py-4 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full hover:bg-red-600 hover:text-white transition-all duration-500 shadow-xl hover:shadow-red-600/40"
                >
                  Enter Mission Control
                </Link>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
              </div>
            )}
          </main>
          
          <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
        </div>
      </SignedIn>
    </>
  );
}