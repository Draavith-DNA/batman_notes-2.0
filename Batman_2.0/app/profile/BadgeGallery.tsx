'use client'

import { useState } from "react";

export default function BadgeGallery({ assets }: { assets: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-8 items-start md:border-l md:border-white/5 md:pl-12">
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => setSelectedImage(asset.badgeImage)}
          >
            {/* 🌟 THE CIRCLE: Strict dimensions and overflow control */}
            <div className="w-24 h-24 rounded-full border-2 border-red-600/40 bg-black flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)] overflow-hidden relative">
              
              <img 
                src={asset.badgeImage || "/badges/default.png"} 
                alt={asset.badgeType} 
                className="w-full h-full object-cover scale-110" // 🌟 'scale-110' zooms in slightly to remove empty edges
              />

              {/* Subtle glass overlay to give it a 'button' feel */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-transparent pointer-events-none" />
            </div>

            <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.3em] mt-3 opacity-60 group-hover:opacity-100 transition-opacity text-center">
              {asset.badgeType}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL POPUP */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl cursor-zoom-out p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative flex flex-col items-center animate-in zoom-in-95 duration-300">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.6em] mb-8 italic">Asset Detailed Analysis</p>
            <img 
              src={selectedImage} 
              className="max-w-[85vw] max-h-[75vh] object-contain drop-shadow-[0_0_60px_rgba(220,38,38,0.6)]"
              alt="Expanded Asset"
            />
          </div>
        </div>
      )}
    </>
  );
}