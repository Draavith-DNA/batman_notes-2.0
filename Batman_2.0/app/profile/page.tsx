'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  
  // STATE
  const [bannerUrl, setBannerUrl] = useState<string>('/background.jpg');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
  // BIO STATE
  const [bio, setBio] = useState<string>(''); 
  const [isEditingBio, setIsEditingBio] = useState(false); // Toggle for Edit Mode

  // Load User Data
  useEffect(() => {
    if (user) {
      if (user.imageUrl) setAvatarUrl(user.imageUrl);
      // Load Bio from Metadata (if it exists)
      const savedBio = (user.publicMetadata.bio as string) || "Hero in training.";
      setBio(savedBio);
    }
  }, [user]);

  // Handlers
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBannerUrl(URL.createObjectURL(file));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const saveBio = () => {
    setIsEditingBio(false);
    // NOTE: In a real app, you would call a Server Action here to save 'bio' to the database.
    // For now, it just updates the local view.
    alert("Bio updated locally! (Connect DB to save permanently)");
  };

  if (!isLoaded || !user) return null;

  const branch = (user.publicMetadata.branch as string) || "Unknown";
  const semester = (user.publicMetadata.semester as string) || "N/A";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 relative">
      <div className="fixed inset-0 z-0 animate-reveal bg-black pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10 animate-card">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* BANNER */}
          <div className="relative h-48 md:h-64 group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${bannerUrl})` }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all" />
            <label className="absolute top-4 right-4 cursor-pointer">
              <div className="bg-black/60 hover:bg-red-600 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 text-xs font-bold shadow-lg">
                <span>📷 Edit Banner</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
            </label>
          </div>

          {/* PROFILE CONTENT */}
          <div className="px-6 pb-8 relative">
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              
              {/* AVATAR (Left Side) */}
              <div className="relative -mt-12 md:-mt-16 inline-block shrink-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-black overflow-hidden relative bg-gray-800 shadow-2xl">
                  {avatarUrl && (
                    <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
                  )}
                </div>
                {/* Tiny Plus Icon for Avatar Change */}
                <label className="absolute bottom-1 right-1 cursor-pointer bg-blue-500 text-white p-1.5 rounded-full border-2 border-black hover:bg-blue-600 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              {/* RIGHT SIDE: INSTAGRAM STYLE INFO */}
              <div className="flex-1 w-full pt-2 md:pt-4">
                
                {/* 1. NAME & STATS ROW */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                      {user.fullName} 
                      {/* Verified Badge (Just for aesthetics) */}
                      <span className="text-blue-500" title="Verified Hero">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                      {branch} Student • Semester {semester}
                    </p>
                  </div>

                  {/* Following/Followers Stats Box */}
                  <div className="flex gap-6 text-white text-sm">
                    <div className="text-center">
                      <span className="font-bold block text-lg">0</span> followers
                    </div>
                    <div className="text-center">
                      <span className="font-bold block text-lg">0</span> following
                    </div>
                  </div>
                </div>

                {/* 2. THE BIO (Insta Style) */}
                <div className="mt-4 max-w-lg">
                  {!isEditingBio ? (
                    // VIEW MODE
                    <div className="group relative">
                      <p className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                        {bio}
                      </p>
                      {/* Small Edit Button appears on hover or always visible */}
                      <button 
                        onClick={() => setIsEditingBio(true)}
                        className="mt-2 text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit Bio
                      </button>
                    </div>
                  ) : (
                    // EDIT MODE
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                      <textarea
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-sm focus:border-red-600 outline-none resize-none"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={saveBio}
                          className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-md hover:bg-gray-200"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setIsEditingBio(false)}
                          className="px-4 py-1.5 bg-transparent border border-white/20 text-white text-xs font-bold rounded-md hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. LINKS / ACTION BUTTONS */}
                <div className="mt-6 flex gap-3">
                  <Link 
                    href="/" 
                    className="flex-1 md:flex-none bg-white/10 text-white text-sm font-bold py-2 px-6 rounded-lg hover:bg-white/20 transition text-center"
                  >
                    Dashboard
                  </Link>
                  <button className="flex-1 md:flex-none bg-white/10 text-white text-sm font-bold py-2 px-6 rounded-lg hover:bg-white/20 transition">
                    Share Profile
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}