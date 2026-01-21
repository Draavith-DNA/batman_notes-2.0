'use client'

import { useState } from "react";
import { updateBio } from "../actions";

export default function BioEditor({ initialBio }: { initialBio: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(initialBio);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await updateBio(bio);
    setIsEditing(false);
    setLoading(false);
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <textarea 
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full bg-black border border-red-900/30 p-4 text-sm text-gray-300 outline-none focus:border-red-600 transition-all min-h-[120px]"
        />
        <div className="flex gap-4">
          <button onClick={handleSave} disabled={loading} className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-white transition-colors">
            {loading ? "Saving..." : "Commit Changes"}
          </button>
          <button onClick={() => setIsEditing(false)} className="text-[9px] font-black uppercase tracking-widest text-gray-600">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
        {bio}
      </p>
      <button 
        onClick={() => setIsEditing(true)}
        className="mt-4 text-[9px] font-black uppercase tracking-widest text-gray-700 group-hover:text-red-600 transition-colors"
      >
        [ Edit Biography ]
      </button>
    </div>
  );
}