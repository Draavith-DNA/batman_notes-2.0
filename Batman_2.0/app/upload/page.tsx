export const dynamic = "force-dynamic";

import { uploadNote } from "../actions"; 
import { useState } from "react";
import { auth } from "@clerk/nextjs/server";

export default function UploadPage() {
  const [status, setStatus] = useState("");
  const [selectedSem, setSelectedSem] = useState("1"); // Default to 1st Year

  // 🌟 THE BUILD-TIME GUARD: 
  // Prevents Vercel from crashing during 'npm run build' when there is no user session.
  // Note: Since this is a Client Component, we handle the check inside the component 
  // or via middleware. However, to keep it 'Vercel-proof' for dynamic data fetching 
  // if you add any, this is the pattern.
  
  async function handleSubmit(formData: FormData) {
    setStatus("INITIALIZING UPLOAD...");
    
    // 🌟 LOGIC: If it's 1st year, force the Branch to 'COMMON'
    if (selectedSem === "1") {
      formData.set("branch", "COMMON");
    } else {
      // If it's higher sem, we don't need a cycle
      formData.set("cycle", "none");
    }

    const result = await uploadNote(formData);
    
    if (result.message === "success") {
      setStatus("✅ DATA SECURED IN THE BAT-COMPUTER!");
    } else {
      setStatus("❌ UPLOAD INTERRUPTED");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex justify-center relative">
      <div className="fixed inset-0 z-0 bg-black/60 pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 animate-card">
        <div className="bg-black/40 backdrop-blur-xl border border-red-600/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.15)]">
          
          <div className="mb-8 border-b border-white/10 pb-4 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">
              Secure Upload <span className="text-red-600">Protocol</span>
            </h1>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
              Adding New Intelligence to the Network
            </p>
          </div>
          
          <form action={handleSubmit} className="space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Title</label>
              <input name="title" required placeholder="e.g. Module 1: Cryptography" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none transition-all placeholder:text-gray-700" />
            </div>

            {/* Google Drive Link */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Drive Link (URL)</label>
              <input name="url" required type="url" placeholder="https://drive.google.com/..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none transition-all placeholder:text-gray-700 font-mono text-sm" />
            </div>

            {/* Subject Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Subject Name</label>
              <input name="subject" required placeholder="e.g. Distributed Systems" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none transition-all placeholder:text-gray-700" />
            </div>

            {/* Selectors Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Semester</label>
                <select 
                  name="semester" 
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="1">1st Year (Common)</option>
                  {[3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>{s}th Semester</option>
                  ))}
                </select>
              </div>

              <div>
                {/* 🌟 DYNAMIC SELECTOR: SHOW CYCLE FOR 1st YEAR, BRANCH FOR OTHERS */}
                {selectedSem === "1" ? (
                  <>
                    <label className="block text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 ml-1">Identify Cycle</label>
                    <select name="cycle" required className="w-full bg-red-900/20 border border-red-600/50 rounded-xl p-3 text-white focus:border-red-600 outline-none transition-all appearance-none cursor-pointer">
                      <option value="P-Cycle">P-Cycle</option>
                      <option value="C-Cycle">C-Cycle</option>
                    </select>
                  </>
                ) : (
                  <>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Branch</label>
                    <select name="branch" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none transition-all appearance-none cursor-pointer">
                      <option value="CSE">CSE</option>
                      <option value="ISE">ISE</option>
                      <option value="ECE">ECE</option>
                      <option value="MECH">MECH</option>
                      <option value="AIML">AIML</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Content Type</label>
              <select name="type" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-red-600 outline-none transition-all appearance-none cursor-pointer">
                <option value="notes">Notes</option>
                <option value="textbook">Textbook</option>
                <option value="qp">Question Papers</option>
                <option value="lab">Lab Manuals</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg active:scale-95"
            >
              Execute Upload
            </button>

            {status && (
              <div className="mt-6 text-center">
                <p className={`text-xs font-bold tracking-widest uppercase py-2 rounded-lg border ${status.includes('✅') ? 'text-green-500 border-green-600/20 bg-green-600/10' : 'text-red-500 border-red-600/20 bg-red-600/10'}`}>
                  {status}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}