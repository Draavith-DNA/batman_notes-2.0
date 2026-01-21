'use client';

export const dynamic = "force-dynamic";

import { useState } from "react";
import { bulkPromoteSemester, bulkSwitchCycle, grantBadge } from "@/app/actions";
import { useAuth } from "@clerk/nextjs";

export default function AdminPage() {
  const { userId, isLoaded } = useAuth();
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>(["[SYSTEM READY] awaiting commands..."]);

  const addLog = (msg: string) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  // 🌟 THE BUILD-TIME & AUTH GUARD:
  // Since this is a client component, we check if Clerk is loaded and if a user exists.
  // This prevents any accidental execution during build or by unauthorized visitors.
  if (!isLoaded) return null; 
  if (!userId) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-red-600 font-mono text-xs tracking-widest uppercase">Access Denied // Authorization Required</div>;
  }

  async function handleBulkPromote(current: string, next: string) {
    setLoading(true);
    addLog(`INITIATING MASS ELEVATION: SEM ${current} -> ${next}`);
    const res = await bulkPromoteSemester(current, next);
    if (res.success) addLog(`SUCCESS: ${res.count} agents promoted.`);
    else addLog(`ERROR: Process interrupted.`);
    setLoading(false);
  }

  async function handleCycleFlip(from: string, to: string) {
    setLoading(true);
    addLog(`INITIATING CYCLE ROTATION: ${from} -> ${to}`);
    const res = await bulkSwitchCycle(from, to);
    if (res.success) addLog(`SUCCESS: ${res.count} agents rotated.`);
    else addLog(`ERROR: Rotation failed.`);
    setLoading(false);
  }

  async function handleManualBadge(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await grantBadge(formData);
    addLog(res.message);
    if (res.success) (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-10 bg-black text-white font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black tracking-widest uppercase mb-12 border-l-4 border-red-600 pl-6">
          System <span className="text-red-600">Operations</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* SEMESTER MIGRATION */}
          <div className="border border-white/10 p-8 rounded-3xl bg-white/[0.02]">
            <h2 className="text-red-600 text-[10px] font-black mb-6 uppercase tracking-[0.4em]">Tier Elevation</h2>
            <div className="space-y-3">
              {[["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"], ["5", "6"], ["6", "7"], ["7", "8"]].map(([cur, nxt]) => (
                <button 
                  key={cur}
                  onClick={() => handleBulkPromote(cur, nxt)}
                  className="w-full text-left p-3 border border-white/5 hover:border-red-600 transition-all text-[9px] font-bold uppercase tracking-widest"
                >
                  Promote: {cur} Sem → {nxt} Sem
                </button>
              ))}
            </div>
          </div>

          {/* CYCLE & BADGES */}
          <div className="border border-white/10 p-8 rounded-3xl bg-white/[0.02]">
            <h2 className="text-red-600 text-[10px] font-black mb-6 uppercase tracking-[0.4em]">Cycle Rotation</h2>
            <div className="space-y-3">
              <button onClick={() => handleCycleFlip("C-Cycle", "P-Cycle")} className="w-full text-left p-3 border border-white/5 hover:border-red-600 transition-all text-[9px] font-bold uppercase tracking-widest">Rotate: C-Cycle → P-Cycle</button>
              <button onClick={() => handleCycleFlip("P-Cycle", "C-Cycle")} className="w-full text-left p-3 border border-white/5 hover:border-red-600 transition-all text-[9px] font-bold uppercase tracking-widest">Rotate: P-Cycle → C-Cycle</button>
              
              <div className="mt-12 pt-8 border-t border-white/10">
                <h2 className="text-gray-500 text-[10px] font-black mb-4 uppercase tracking-[0.4em]">Manual Asset Grant</h2>
                <form onSubmit={handleManualBadge} className="space-y-4">
                  <input name="usn" placeholder="AGENT USN" required className="w-full bg-black border border-white/10 p-3 rounded-lg text-[10px] uppercase outline-none focus:border-red-600" />
                  <select name="badgeType" className="w-full bg-black border border-white/10 p-3 rounded-lg text-[10px] uppercase outline-none">
                    <option value="CONTRIBUTOR">Contributor</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="LEGEND">Legend</option>
                  </select>
                  <button type="submit" className="w-full bg-white text-black py-3 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Authorize Badge</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* LOG CONSOLE */}
        <div className="mt-12 p-6 bg-black/80 border border-white/5 rounded-2xl h-48 overflow-y-auto">
          <p className="text-[8px] text-gray-600 font-bold uppercase mb-4 tracking-widest">Live Output Console</p>
          <div className="space-y-1">
            {log.map((entry, i) => (
              <p key={i} className={`text-[10px] font-mono ${entry.includes('SUCCESS') ? 'text-green-500' : entry.includes('ERROR') ? 'text-red-500' : 'text-gray-400'}`}>
                {entry}
              </p>
            ))}
            {loading && <p className="text-[10px] text-red-600 animate-pulse uppercase tracking-widest">Executing Command...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}