import React from "react";
import { X, ExternalLink, Heart, Film, Music, Github, Instagram, Sparkles, MapPin, Coffee } from "lucide-react";
import { CONFIG } from "../config";

interface AboutPanelProps {
  onClose: () => void;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ onClose }) => {
  return (
    <div
      id="about-modal-backdrop"
      className="fixed inset-0 z-45 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="about-panel"
        className="relative w-full max-w-md rounded-3xl glass-panel text-amber-50 p-6 sm:p-8 shadow-2xl border border-amber-300/20 max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-about-panel"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 flex items-center justify-center border border-amber-300/20 transition-all cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with gentle icon */}
        <div className="flex items-center gap-2 mb-3 text-amber-400 text-xs font-semibold tracking-widest uppercase">
          <Sparkles className="w-4 h-4" />
          <span>About My Little World</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-3 tracking-wide" style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>
          Welcome to my little world.
        </h2>

        {/* Nostalgic Japanese subtitle */}
        <div className="text-xs text-amber-300/70 mb-4 font-light tracking-wider">
          小さな世界へようこそ • 音楽と記憶の場所
        </div>

        {/* Main Body Text from prompt */}
        <div className="space-y-3 text-sm text-amber-100/80 leading-relaxed mb-6 font-normal">
          <p className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-300/15 text-amber-100 font-medium">
            "This is a small interactive space for music, movies, memories and things I love."
          </p>
          <p>
            Designed to feel like taking a slow, peaceful walk through a quiet anime town during golden hour. Where the cicadas sing in the tall trees, the train signal rings across distant fields, and the world moves just a little slower.
          </p>
        </div>

        {/* Cozy tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-amber-200/80">
            <MapPin className="w-3 h-3 text-amber-400" />
            Japanese Summer
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-amber-200/80">
            <Coffee className="w-3 h-3 text-amber-400" />
            Lo-Fi & Ambient
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-amber-200/80">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40" />
            Nostalgia
          </span>
        </div>

        {/* Social Links List */}
        <div className="space-y-2">
          <span className="text-xs text-amber-300/60 uppercase tracking-wider font-semibold px-1">
            Connect & Follow
          </span>

          <div className="grid grid-cols-1 gap-2">
            {/* Instagram */}
            <a
              href={CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-400/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-100 group-hover:text-pink-300 transition-colors">
                    Instagram
                  </div>
                  <div className="text-[11px] text-amber-200/50">
                    Daily photos & anime moments
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-300/50 group-hover:text-amber-200" />
            </a>

            {/* Letterboxd */}
            <a
              href={CONFIG.letterboxd}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-100 group-hover:text-emerald-300 transition-colors">
                    Letterboxd
                  </div>
                  <div className="text-[11px] text-amber-200/50">
                    Films, anime & reviews
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-300/50 group-hover:text-amber-200" />
            </a>

            {/* Spotify */}
            <a
              href={CONFIG.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-300 flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-100 group-hover:text-green-300 transition-colors">
                    Spotify
                  </div>
                  <div className="text-[11px] text-amber-200/50">
                    Chill playlists & Japanese city pop
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-300/50 group-hover:text-amber-200" />
            </a>

            {/* GitHub */}
            <a
              href={CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-100 group-hover:text-purple-300 transition-colors">
                    GitHub
                  </div>
                  <div className="text-[11px] text-amber-200/50">
                    Open source code & repositories
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-300/50 group-hover:text-amber-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
