import React from "react";
import { X, ChevronLeft, ChevronRight, Compass, Volume2, Sparkles } from "lucide-react";
import { LOCATIONS } from "../data/locations";
import { LocationData } from "../types";

interface ExplorePanelProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onClose: () => void;
}

export const ExplorePanel: React.FC<ExplorePanelProps> = ({
  currentLocation,
  onSelectLocation,
  onClose
}) => {
  const currentIndex = LOCATIONS.findIndex((l) => l.id === currentLocation.id);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + LOCATIONS.length) % LOCATIONS.length;
    onSelectLocation(LOCATIONS[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % LOCATIONS.length;
    onSelectLocation(LOCATIONS[nextIdx]);
  };

  return (
    <div
      id="explore-modal-backdrop"
      className="fixed inset-0 z-45 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="explore-panel"
        className="relative w-full max-w-2xl rounded-3xl glass-panel text-amber-50 p-6 sm:p-8 shadow-2xl border border-amber-300/20 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-explore-panel"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 flex items-center justify-center border border-amber-300/20 transition-all cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1 text-amber-400 text-xs font-semibold tracking-widest uppercase">
          <Compass className="w-4 h-4" />
          <span>Town Explorer • 町の散策</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-4 tracking-wide">
          {currentLocation.name}
        </h2>

        {/* Main Location Display Card */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-300/20 shadow-lg mb-6 group aspect-video bg-amber-950/40">
          <img
            src={currentLocation.background}
            alt={currentLocation.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/20">
              {currentLocation.japaneseName}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-amber-200 border border-amber-400/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {currentLocation.mood}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-left">
            <p className="text-sm sm:text-base text-amber-100 font-medium drop-shadow-md">
              "{currentLocation.quote}"
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-amber-200/80 leading-relaxed mb-6 font-normal">
          {currentLocation.description}
        </p>

        {/* Ambient indicator */}
        <div className="flex items-center gap-2 text-xs text-amber-300/70 mb-6 bg-amber-400/5 px-3 py-2 rounded-xl border border-amber-400/10">
          <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Ambient soundscape attuned to: <strong className="text-amber-200 capitalize">{currentLocation.ambientSound}</strong></span>
        </div>

        {/* Navigation Controls: Previous / Next & Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-amber-200/10 mb-6">
          <button
            id="explore-prev-button"
            onClick={handlePrev}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 text-sm font-medium border border-amber-300/20 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>← Previous</span>
          </button>

          <span className="text-xs tracking-widest text-amber-300/80 font-mono font-bold">
            0{currentIndex + 1} / 0{LOCATIONS.length}
          </span>

          <button
            id="explore-next-button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 text-sm font-medium border border-amber-300/20 transition-all cursor-pointer"
          >
            <span>NEXT →</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick jump thumbnails */}
        <div className="space-y-2">
          <span className="text-xs text-amber-300/60 uppercase tracking-wider font-semibold">
            All Destinations ({LOCATIONS.length})
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {LOCATIONS.map((loc, idx) => {
              const isSelected = loc.id === currentLocation.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => onSelectLocation(loc)}
                  className={`flex flex-col items-center p-1.5 rounded-xl border transition-all text-center group cursor-pointer ${
                    isSelected
                      ? "bg-amber-400/25 border-amber-400 text-amber-100 shadow-md"
                      : "bg-black/20 border-white/10 hover:border-amber-300/40 text-amber-200/60 hover:text-amber-100"
                  }`}
                >
                  <div className="w-full aspect-video rounded-lg overflow-hidden mb-1 bg-black/40">
                    <img
                      src={loc.background}
                      alt={loc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] leading-tight truncate w-full font-medium">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
