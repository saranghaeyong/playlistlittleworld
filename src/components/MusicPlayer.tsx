import React from "react";
import { Play, Pause, Music2, SkipForward } from "lucide-react";
import { PlaylistItem } from "../types";

interface MusicPlayerProps {
  currentTrack: PlaylistItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onOpenPlaylist: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onOpenPlaylist
}) => {
  return (
    <div
      id="floating-music-player"
      className="fixed z-40 bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 transition-all select-none"
    >
      <div
        onClick={onOpenPlaylist}
        className="group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl glass-pill hover:border-amber-300/40 text-amber-50 shadow-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
        title="Click to open full playlist"
      >
        {/* Cover Thumbnail with subtle spin when playing */}
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md border border-amber-300/20 shrink-0">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-0.5 bg-amber-300 animate-pulse h-3" />
                <span className="w-0.5 bg-amber-300 animate-pulse h-2" style={{ animationDelay: "0.2s" }} />
                <span className="w-0.5 bg-amber-300 animate-pulse h-3" style={{ animationDelay: "0.4s" }} />
              </span>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="min-w-0 pr-1 max-w-[140px] sm:max-w-[170px]">
          <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-mono font-semibold tracking-wider uppercase">
            <Music2 className="w-3 h-3 text-amber-400" />
            <span>NOW PLAYING</span>
          </div>
          <div className="text-xs font-bold text-amber-100 truncate">
            {currentTrack.title}
          </div>
          <div className="text-[10px] text-amber-200/60 truncate">
            {currentTrack.artist}
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-1.5 pl-1" onClick={(e) => e.stopPropagation()}>
          <button
            id="bgm-play-toggle-btn"
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause BGM" : "Play BGM"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-amber-950" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-amber-950 ml-0.5" />
            )}
          </button>

          <button
            id="bgm-next-track-btn"
            onClick={onNextTrack}
            className="w-7 h-7 rounded-full hover:bg-white/10 text-amber-200/80 hover:text-amber-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
