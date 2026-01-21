'use client';

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/app/actions"; 

export default function OnboardingForm() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    usn: "",
    branch: "",
    semester: "",
    cycle: "none", // 🌟 New Cycle Field
    dob: "",
    bio: "" 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("usn", formData.usn.toUpperCase()); // 🌟 Force UpperCase on Submit
      data.append("branch", formData.branch);
      data.append("semester", formData.semester);
      data.append("cycle", formData.cycle);
      data.append("dob", formData.dob);
      data.append("bio", formData.bio);

      const result = await completeOnboarding(data);

      if (result.success) {
        await user?.reload();
        router.refresh(); 
        window.location.href = "/"; // Force a hard refresh to update the Layout Nav
      } else {
        alert(result.message || "Something went wrong. Try again.");
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
          Complete your profile to access the intelligence network
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
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">USN (Unique ID)</label>
            <input 
              type="text"
              placeholder="4JC..."
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all uppercase"
              value={formData.usn}
              onChange={(e) => setFormData({...formData, usn: e.target.value.toUpperCase()})}
              required
            />
          </div>
        </div>

        {/* ROW 2: Branch & Semester */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Branch / Sector</label>
            <select 
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all appearance-none"
              value={formData.branch}
              onChange={(e) => setFormData({...formData, branch: e.target.value})}
              required
            >
              <option value="" disabled>Select Branch</option>
              <option value="CSE">CSE (Computer Science)</option>
              <option value="ISE">ISE (Information Science)</option>
              <option value="ECE">ECE (Electronics)</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
              <option value="AIML">AI & ML</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Tier (Semester)</label>
            <select 
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all appearance-none"
              value={formData.semester}
              onChange={(e) => setFormData({...formData, semester: e.target.value})}
              required
            >
              <option value="" disabled>Select Semester</option>
              <option value="1">1st Year (Select Cycle Below)</option>
              {[3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>{sem} Semester</option>
              ))}
            </select>
          </div>
        </div>

        {/* 🌟 NEW ROW: CYCLE (Shown only if 1st Year is selected) 🌟 */}
        <div className={`transition-all duration-500 ${formData.semester === "1" ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"}`}>
          <label className="block text-red-500 text-xs font-bold uppercase mb-2 tracking-widest">Identify Cycle</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setFormData({...formData, cycle: "P-Cycle"})}
              className={`p-3 rounded-lg border font-bold uppercase text-xs transition-all ${formData.cycle === "P-Cycle" ? "bg-red-600 border-red-600 text-white" : "bg-black/20 border-gray-700 text-gray-500 hover:border-red-600"}`}
            >
              P-Cycle
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, cycle: "C-Cycle"})}
              className={`p-3 rounded-lg border font-bold uppercase text-xs transition-all ${formData.cycle === "C-Cycle" ? "bg-red-600 border-red-600 text-white" : "bg-black/20 border-gray-700 text-gray-500 hover:border-red-600"}`}
            >
              C-Cycle
            </button>
          </div>
        </div>

        {/* ROW 4: DOB */}
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

        {/* ROW 5: BIO */}
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Bio (The Mission)</label>
          <textarea 
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all resize-none placeholder:text-gray-600"
            rows={3}
            placeholder="E.g. Aspiring Developer | 'I am Vengeance'"
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
          {loading ? "AUTHENTICATING..." : "ENTER SYSTEM"}
        </button>

      </form>
    </div>
  );
}