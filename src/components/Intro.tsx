import React from "react";
import { Compass, Sparkles, Volume2 } from "lucide-react";

interface IntroProps {
  onStart: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart }) => {
  return (
    <div
      id="intro-overlay"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-all duration-1000 select-none p-6"
    >
      <div
        id="intro-modal"
        className="max-w-md w-full text-center px-8 py-10 rounded-3xl bg-[#1d1627]/80 backdrop-blur-md border border-amber-200/20 shadow-2xl transition-all"
      >
        {/* Decorative subtle header badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-300/20 text-amber-200 text-xs tracking-widest uppercase mb-6 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Summer Evening Stroll</span>
        </div>

        {/* Center Main Titles */}
        <h1
          id="intro-title"
          className="text-4xl sm:text-5xl font-bold tracking-wider text-amber-100 mb-3"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          TAKE A WALK
        </h1>

        <p className="text-amber-200/75 text-sm sm:text-base font-medium tracking-wide mb-8">
          a little place to slow down
        </p>

        {/* Japanese subtitle phrase */}
        <div className="text-xs text-amber-300/60 tracking-widest mb-8 font-light">
          夕暮れの街角 • 風の音 • 穏やかな時間
        </div>

        {/* Start Walk Button */}
        <button
          id="start-walk-button"
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-amber-950 font-semibold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span>START WALK</span>
          <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
        </button>

        {/* Gentle sound hint */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-amber-200/50">
          <Volume2 className="w-3.5 h-3.5" />
          <span>Best experienced with sound enabled</span>
        </div>
      </div>
    </div>
  );
};
