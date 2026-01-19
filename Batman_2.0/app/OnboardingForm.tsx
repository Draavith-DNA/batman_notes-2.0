'use client';

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/app/actions"; 

export default function OnboardingForm() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // We use simple state for the inputs to make them controlled
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    usn: "",
    branch: "",
    semester: "",
    dob: "",
    bio: "" // 🌟 The New Bio Field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create FormData object (Required by your actions.ts)
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("usn", formData.usn);
      data.append("branch", formData.branch);
      data.append("semester", formData.semester);
      data.append("dob", formData.dob);
      data.append("bio", formData.bio);

      // 2. Call the Server Action
      const result = await completeOnboarding(data);

      if (result.message === "success") {
        // 3. Reload user to refresh metadata & redirect
        await user?.reload();
        router.refresh(); 
      } else {
        alert("Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Onboarding Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-md p-8 rounded-2xl border border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)] max-w-2xl mx-auto mt-10 animate-card">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">
          Identity Protocol
        </h2>
        <p className="text-gray-400 text-sm">
          Required to access the Batcomputer network.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ROW 1: Name & USN */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Full Name</label>
            <input 
              type="text"
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">USN (ID)</label>
            <input 
              type="text"
              placeholder="1MJ..."
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all uppercase"
              value={formData.usn}
              onChange={(e) => setFormData({...formData, usn: e.target.value})}
              required
            />
          </div>
        </div>

        {/* ROW 2: Branch & Semester */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Branch</label>
            <select 
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all appearance-none"
              value={formData.branch}
              onChange={(e) => setFormData({...formData, branch: e.target.value})}
              required
            >
              <option value="" disabled className="text-gray-500">Select Branch</option>
              <option value="CSE">CSE (Computer Science)</option>
              <option value="ISE">ISE (Information Science)</option>
              <option value="ECE">ECE (Electronics)</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
              <option value="AIML">AI & ML</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Semester</label>
            <select 
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all appearance-none"
              value={formData.semester}
              onChange={(e) => setFormData({...formData, semester: e.target.value})}
              required
            >
              <option value="" disabled>Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>{sem} Semester</option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 3: DOB */}
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Date of Birth</label>
          <input 
            type="date"
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all [color-scheme:dark]"
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            required
          />
        </div>

        {/* 🌟 ROW 4: BIO (The Mission) 🌟 */}
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase mb-2">
            Bio (Your Mission)
          </label>
          <textarea 
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all resize-none placeholder:text-gray-600"
            rows={3}
            placeholder="E.g. Aspiring Developer | Gym Rat | 'I am Vengeance'"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-white text-black font-extrabold text-lg py-4 rounded-lg hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300 uppercase tracking-widest mt-6"
        >
          {loading ? "INITIALIZING..." : "ENTER SYSTEM"}
        </button>

      </form>
    </div>
  );
}