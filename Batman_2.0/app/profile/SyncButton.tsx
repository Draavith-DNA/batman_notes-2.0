'use client'

import { useState } from "react";
import { syncUserToNetwork } from "../actions";
import { useRouter } from "next/navigation";

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSync() {
    setLoading(true);
    await syncUserToNetwork();
    setLoading(false);
    alert("✅ Profile Synced to Network!");
    router.refresh();
  }

  return (
    <button 
      onClick={handleSync}
      disabled={loading}
      className="mt-4 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded border border-gray-300 transition"
    >
      {loading ? "Syncing..." : "🔄 Sync Profile to Network"}
    </button>
  );
}