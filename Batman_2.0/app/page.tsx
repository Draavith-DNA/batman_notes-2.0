import { currentUser } from '@clerk/nextjs/server';
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import OnboardingForm from './OnboardingForm';

export default async function Home() {
  const user = await currentUser();

  // Get Onboarding Status
  const isOnboarded = user?.publicMetadata?.onboardingComplete === true;

  return (
    <>
      {/* =========================================================
          VIEW 1: SIGNED OUT (LOGIN) -> KEEPING YOUR VIDEO DESIGN
      ========================================================= */}
      <SignedOut>
        <main className="fixed inset-0 h-screen w-screen overflow-hidden">
          
          {/* Fade-in Overlay */}
          <div className="absolute inset-0 bg-black z-30 animate-reveal pointer-events-none" />

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

          {/* Dark Tint */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

          {/* Content */}
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
          VIEW 2: SIGNED IN (MINIMALIST MISSION CONTROL)
      ========================================================= */}
      <SignedIn>
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
          
          {/* DASHBOARD FADE IN EFFECT */}
          <div className="fixed inset-0 z-0 animate-reveal bg-black/40 pointer-events-none" />

          <main className="relative z-10 w-full max-w-5xl px-6">
            {!isOnboarded ? (
              /* Still show onboarding if they haven't finished it */
              <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-red-600/30 shadow-2xl">
                <OnboardingForm />
              </div>
            ) : (
              /* 🌟 THE NEW MINIMALIST HOME 🌟 */
              <div className="flex flex-col items-center justify-center animate-card">
                
                {/* Subtle Breathing System Text */}
                <div className="animate-pulse duration-[5000ms] text-center">
                  <h2 className="text-[11px] md:text-[13px] font-black uppercase tracking-[1.2em] text-white/20 hover:text-red-600/40 transition-colors duration-1000 cursor-default select-none">
                    System Active // Monitoring Sector
                  </h2>
                </div>

                {/* Atmospheric Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

              </div>
            )}
          </main>
          
          {/* Global Dark Gradient to blend with background image */}
          <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
        </div>
      </SignedIn>
    </>
  );
}