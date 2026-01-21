'use client';

import { grantBadge } from "@/app/actions";
import { useState } from "react";

export default function BadgesAdminPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(formData: FormData) {
    const res = await grantBadge(formData);
    setStatus(res.message);
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-black flex items-center justify-center">
      <main className="max-w-md w-full relative z-10">
        <div className="bg-black/60 backdrop-blur-xl border-2 border-red-600 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.2)]">
          
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white mb-2 text-center">
            Badge <span className="text-red-600">Issuer</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-8">
            Authorized Personnel Only
          </p>

          <form action={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">User USN</label>
              <input 
                name="usn" 
                placeholder="e.g., 4JC22CS000"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none transition-all mt-2"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Badge Type</label>
              <select 
                name="badgeType"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none transition-all mt-2 appearance-none"
              >
                <option value="contributor">CONTRIBUTOR</option>
                <option value="moderator">MODERATOR</option>
                <option value="elite">ELITE HERO</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] transition-all shadow-lg"
            >
              Issue Badge
            </button>
          </form>

          {status && (
            <p className="mt-6 text-center text-xs font-bold text-red-500 uppercase animate-pulse">
              {status}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}