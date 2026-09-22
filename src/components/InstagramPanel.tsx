import React from "react";
import { X, ExternalLink, Heart, Camera, Bookmark } from "lucide-react";
import { CONFIG } from "../config";
import lofiCoverImg from "../assets/images/anime_lofi_cover_1790070217144.jpg";

interface InstagramPanelProps {
  onClose: () => void;
}

export const InstagramPanel: React.FC<InstagramPanelProps> = ({ onClose }) => {
  return (
    <div
      id="instagram-modal-backdrop"
      className="fixed inset-0 z-45 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="instagram-panel"
        className="relative w-full max-w-sm rounded-3xl glass-panel text-amber-50 p-6 sm:p-7 shadow-2xl border border-pink-300/25 transition-all text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-instagram-panel"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 flex items-center justify-center border border-white/15 transition-all cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Instagram Icon Header */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20 p-0.5">
          <div className="w-full h-full bg-[#1e1528] rounded-[14px] flex items-center justify-center">
            <Camera className="w-8 h-8 text-pink-400" />
          </div>
        </div>

        {/* Profile Details */}
        <h3 className="text-xl font-bold text-amber-50 mb-0.5 tracking-wide">
          @{CONFIG.username}
        </h3>
        <p className="text-xs text-pink-300/80 font-medium mb-3">
          {CONFIG.displayName} • 写真とスケッチ
        </p>

        {/* Cozy Mini-Feed Preview Mock */}
        <div className="relative rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/30 aspect-square group">
          <img
            src={lofiCoverImg}
            alt="Summer gallery preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 flex items-end justify-between p-3 text-xs text-pink-200">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> 1,248</span>
              <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5 text-amber-300" /> 342</span>
            </div>
            <span className="text-[10px] text-amber-200/70">#summerwalks</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-amber-100/75 leading-relaxed mb-6 px-2">
          {CONFIG.bio}
        </p>

        {/* OPEN INSTAGRAM BUTTON */}
        <a
          id="open-instagram-button"
          href={CONFIG.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-semibold text-sm shadow-lg shadow-pink-600/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>OPEN INSTAGRAM</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <p className="text-[10px] text-amber-300/40 mt-3">
          Opens in a new tab • {CONFIG.instagram}
        </p>
      </div>
    </div>
  );
};
