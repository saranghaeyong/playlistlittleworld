import React from "react";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { LOCATIONS } from "../data/locations";
import { LocationData } from "../types";

interface LocationSelectorProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onOpenExplore: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onSelectLocation,
  onOpenExplore
}) => {
  const currentIndex = LOCATIONS.findIndex((l) => l.id === currentLocation.id);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentIndex - 1 + LOCATIONS.length) % LOCATIONS.length;
    onSelectLocation(LOCATIONS[prevIdx]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % LOCATIONS.length;
    onSelectLocation(LOCATIONS[nextIdx]);
  };

  return (
    <div
      id="bottom-right-location-indicator"
      className="fixed z-40 bottom-4 right-4 sm:right-6 select-none"
    >
      <div
        onClick={onOpenExplore}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-pill hover:border-amber-300/40 text-amber-100 shadow-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] group"
        title="Click to open Town Explorer"
      >
        <div className="flex items-center gap-1">
          <button
            id="quick-prev-loc-btn"
            onClick={handlePrev}
            className="w-6 h-6 rounded-full hover:bg-white/10 text-amber-200/70 hover:text-amber-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Previous Location (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Location Index: 01 / 06 */}
          <div className="flex items-baseline gap-1 px-1 font-mono text-xs font-bold text-amber-300 tracking-wider">
            <span>0{currentIndex + 1}</span>
            <span className="text-amber-200/40 text-[10px]">/</span>
            <span className="text-amber-200/50 text-[10px]">0{LOCATIONS.length}</span>
          </div>

          <button
            id="quick-next-loc-btn"
            onClick={handleNext}
            className="w-6 h-6 rounded-full hover:bg-white/10 text-amber-200/70 hover:text-amber-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Next Location (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Location Title & Compass Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-1.5 border-l border-white/10">
          <span className="text-xs font-semibold text-amber-100/90 truncate max-w-[130px]">
            {currentLocation.name}
          </span>
          <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
};
