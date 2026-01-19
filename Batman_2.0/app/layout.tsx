import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // This imports the Tailwind styles we just fixed
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs'
import Link from "next/link";
import { dark } from '@clerk/themes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Batman 2.0",
  description: "Campus Connect App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body 
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          // 🌟 GLOBAL BACKGROUND IMAGE APPLIED HERE 🌟
          style={{
            backgroundImage: "url('/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh"
          }}
        >
          
          {/* Navbar (Only shows when Signed In) */}
          <SignedIn>
            {/* Made Navbar semi-transparent so image shows through */}
            <nav className="bg-black/80 backdrop-blur-md text-white border-b border-gray-800 px-6 py-4 flex justify-between items-center shadow-md fixed top-0 w-full z-50">
              <Link href="/" className="text-xl font-bold tracking-tight hover:text-gray-300 transition">
                Batman 2.0 🦇
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-400 hover:text-white font-medium text-sm">Home</Link>
                <Link href="/about" className="text-gray-400 hover:text-white font-medium text-sm">About</Link>
                <Link href="/profile" className="text-gray-400 hover:text-white font-medium text-sm">Profile</Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </nav>
            {/* Spacer to push content down below fixed navbar */}
            <div className="h-16"></div>
          </SignedIn>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}