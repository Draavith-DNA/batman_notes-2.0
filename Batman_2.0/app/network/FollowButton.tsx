'use client';

import { useState } from 'react';
import { toggleFollow } from '@/app/actions';

export default function FollowButton({ 
  targetUserId, 
  initialIsFollowing 
}: { 
  targetUserId: string, 
  initialIsFollowing: boolean 
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    const result = await toggleFollow(targetUserId);
    if (result.success) {
      setIsFollowing(!isFollowing);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
        isFollowing 
          ? "bg-transparent border border-white/20 text-white hover:bg-white/5" 
          : "bg-white text-black hover:bg-red-600 hover:text-white"
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}