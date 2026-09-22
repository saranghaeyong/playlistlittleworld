import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Wind,
  CloudRain,
  Bird,
  Bug,
  Music,
  ChevronDown
} from "lucide-react";
import { AmbienceSoundType } from "../types";
import { soundEngine } from "../utils/soundEngine";

interface AmbienceControlProps {
  isBgmPlaying: boolean;
  isAmbiencePlaying: boolean;
  onToggleBgm: () => void;
  onToggleAmbience: () => void;
}

const AMBIENCE_OPTIONS: { type: AmbienceSoundType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: "cicadas", label: "Cicadas", icon: <Bug className="w-3.5 h-3.5" />, desc: "Japanese Higurashi & Minminzemi" },
  { type: "wind", label: "Summer Breeze", icon: <Wind className="w-3.5 h-3.5" />, desc: "Warm evening wind in foliage" },
  { type: "birds", label: "Garden Birds", icon: <Bird className="w-3.5 h-3.5" />, desc: "Quiet twilight sparrows" },
  { type: "rain", label: "Summer Drizzle", icon: <CloudRain className="w-3.5 h-3.5" />, desc: "Refreshing light raindrops" },
];

export const AmbienceControl: React.FC<AmbienceControlProps> = ({
  isBgmPlaying,
  isAmbiencePlaying,
  onToggleBgm,
  onToggleAmbience
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSound, setActiveSound] = useState<AmbienceSoundType>(soundEngine.getState().activeAmbience);
  const [ambienceVol, setAmbienceVol] = useState(soundEngine.getState().ambienceVolume);

  const handleSelectSound = (type: AmbienceSoundType) => {
    setActiveSound(type);
    soundEngine.setAmbienceSound(type);
  };

  const handleAmbienceVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setAmbienceVol(val);
    soundEngine.setAmbienceVolume(val);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        id="ambience-settings-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-2xl glass-pill hover:border-amber-300/40 text-xs text-amber-200/90 font-medium transition-all cursor-pointer shadow-lg"
        title="Ambient soundscapes & audio controls"
      >
        <span className="flex items-center gap-1.5">
          {isAmbiencePlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-amber-300/50" />
          )}
          <span>AMBIENCE</span>
        </span>
        <span className={`w-1.5 h-1.5 rounded-full ${isAmbiencePlaying ? "bg-amber-400" : "bg-white/20"}`} />
        <ChevronDown className={`w-3.5 h-3.5 text-amber-300/60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          id="ambience-settings-popover"
          className="absolute bottom-full mb-3 right-0 sm:left-0 sm:right-auto w-64 rounded-2xl glass-panel p-4 shadow-2xl border border-amber-300/25 z-50 text-amber-100 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-3 flex items-center justify-between">
            <span>Audio Atmosphere</span>
            <span className="text-[10px] text-amber-200/50 font-normal">Dual Track</span>
          </div>

          {/* Master Toggles: BGM and AMBIENCE */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={onToggleBgm}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isBgmPlaying
                  ? "bg-amber-400/25 border-amber-400 text-amber-100 shadow-sm"
                  : "bg-black/20 border-white/10 text-amber-200/50 hover:border-white/20"
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>BGM {isBgmPlaying ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={onToggleAmbience}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isAmbiencePlaying
                  ? "bg-amber-400/25 border-amber-400 text-amber-100 shadow-sm"
                  : "bg-black/20 border-white/10 text-amber-200/50 hover:border-white/20"
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>AMBIENCE {isAmbiencePlaying ? "ON" : "OFF"}</span>
            </button>
          </div>

          {/* Ambience Sound Selector */}
          <div className="space-y-1.5 mb-3 pt-2 border-t border-white/10">
            <div className="text-[11px] text-amber-300/70 font-medium mb-1">
              Select Soundscape
            </div>
            {AMBIENCE_OPTIONS.map((opt) => {
              const isSelected = activeSound === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => handleSelectSound(opt.type)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? "bg-amber-400/15 border-amber-400/40 text-amber-100"
                      : "bg-black/15 border-transparent hover:bg-black/25 text-amber-200/70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={isSelected ? "text-amber-300" : "text-amber-300/60"}>
                      {opt.icon}
                    </span>
                    <div>
                      <div className="text-xs font-medium">{opt.label}</div>
                      <div className="text-[10px] text-amber-200/40">{opt.desc}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Ambience Volume Slider */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <div className="flex justify-between text-[11px] text-amber-300/70">
              <span>Ambience Volume</span>
              <span className="font-mono">{Math.round(ambienceVol * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={ambienceVol}
              onChange={handleAmbienceVolChange}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};
