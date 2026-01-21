import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css"; 
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import Link from "next/link";
import { dark } from '@clerk/themes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BATMAN 2.0",
  description: "Campus Intelligence Network",
  icons: {
    icon: "/favicon.ico?v=2", 
    apple: "/favicon.ico?v=2",
  },
};

// 🌟 Ensure this is exactly "export default async function"
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    user = await currentUser();
  } catch (e) {
    user = null;
  }

  const isOnboarded = !!user?.publicMetadata?.onboardingComplete;

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body 
          className={`${geistSans.variable} antialiased text-white`}
          style={{
            backgroundImage: "url('/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh"
          }}
        >
          <div className="fixed inset-0 bg-black/40 z-[-1]" />

          <SignedIn>
            {user && isOnboarded && (
              <>
                <nav className="bg-black/90 backdrop-blur-xl border-b border-red-900/10 px-10 py-6 flex justify-between items-center fixed top-0 w-full z-50">
                  <Link href="/" className="group">
                    <span className="font-black text-2xl tracking-[0.4em] uppercase transition-all group-hover:text-red-600 duration-700">
                      BATMAN<span className="text-red-600">.</span>2.0
                    </span>
                  </Link>
                  
                  <div className="flex items-center gap-10">
                    <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-red-500 transition-all duration-500">
                      Notes
                    </Link>
                    <Link href="/network" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-all duration-500">
                      Networks
                    </Link>
                    <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-all duration-500">
                      About
                    </Link>
                    <Link href="/profile" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-all duration-500">
                      Profile
                    </Link>
                    
                    <div className="border-l border-white/10 pl-6 ml-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                </nav>
                <div className="h-24"></div>
              </>
            )}
          </SignedIn>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}