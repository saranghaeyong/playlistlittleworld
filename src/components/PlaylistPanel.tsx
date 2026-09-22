import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Disc3,
  Sliders
} from "lucide-react";
import { PLAYLIST } from "../data/playlist";
import { PlaylistItem } from "../types";
import { soundEngine } from "../utils/soundEngine";

interface PlaylistPanelProps {
  currentTrack: PlaylistItem;
  isPlaying: boolean;
  onTrackChange: (track: PlaylistItem) => void;
  onTogglePlay: () => void;
  onClose: () => void;
}

export const PlaylistPanel: React.FC<PlaylistPanelProps> = ({
  currentTrack,
  isPlaying,
  onTrackChange,
  onTogglePlay,
  onClose
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack.duration || 180);
  const [volume, setVolume] = useState(soundEngine.getState().bgmVolume);

  useEffect(() => {
    const unsub = soundEngine.onProgress((time, dur) => {
      setCurrentTime(time);
      if (dur) setDuration(dur);
    });
    return unsub;
  }, []);

  const handlePrev = () => {
    const idx = PLAYLIST.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + PLAYLIST.length) % PLAYLIST.length;
    onTrackChange(PLAYLIST[prevIdx]);
  };

  const handleNext = () => {
    const idx = PLAYLIST.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % PLAYLIST.length;
    onTrackChange(PLAYLIST[nextIdx]);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    soundEngine.seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    soundEngine.setBgmVolume(val);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      id="playlist-modal-backdrop"
      className="fixed inset-0 z-45 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="playlist-panel"
        className="relative w-full max-w-lg rounded-3xl glass-panel text-amber-50 p-6 sm:p-8 shadow-2xl border border-amber-300/20 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-playlist-panel"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 flex items-center justify-center border border-amber-300/20 transition-all cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 text-amber-400 text-xs font-semibold tracking-widest uppercase">
          <Music className="w-4 h-4" />
          <span>Summer Cassette Tape • プレイリスト</span>
        </div>

        {/* Now Playing Featured Card */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-black/30 border border-white/10 mb-6">
          {/* Square Album Artwork */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-xl border border-amber-300/20 group">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? "scale-105" : "scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300">
              <Disc3 className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "5s" }} />
            </div>
          </div>

          {/* Track Info & Controls */}
          <div className="flex-1 text-center sm:text-left min-w-0 w-full">
            <span className="text-[11px] text-amber-400 font-mono font-semibold tracking-wider">
              NOW PLAYING
            </span>
            <h3 className="text-xl font-bold text-amber-100 truncate tracking-wide">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-amber-200/70 truncate mb-3">
              {currentTrack.artist} • {currentTrack.japaneseTitle}
            </p>

            {/* Scrubber Progress Bar */}
            <div className="space-y-1 mb-3">
              <input
                id="playlist-progress-bar"
                type="range"
                min={0}
                max={duration || 180}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-amber-300/60 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full hover:bg-amber-400/15 text-amber-200 transition-colors cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={onTogglePlay}
                className="p-3 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md shadow-amber-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-amber-950" /> : <Play className="w-5 h-5 fill-amber-950 ml-0.5" />}
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-amber-400/15 text-amber-200 transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/20 border border-white/5 mb-6">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-amber-300/50" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-300" />
          )}
          <input
            id="playlist-volume-slider"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-xs font-mono text-amber-300/70 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Song List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-300/70 uppercase tracking-wider font-semibold px-2">
            <span>Summer Tracks ({PLAYLIST.length})</span>
            <span className="flex items-center gap-1 text-[11px] normal-case text-amber-300/50">
              <Sliders className="w-3 h-3" />
              Procedural / Local MP3
            </span>
          </div>

          <div className="space-y-1.5">
            {PLAYLIST.map((item, index) => {
              const isCurrent = item.id === currentTrack.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onTrackChange(item)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-amber-400/20 border-amber-400/40 text-amber-100"
                      : "bg-black/20 border-transparent hover:bg-black/30 hover:border-white/10 text-amber-200/75"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center font-mono text-xs text-amber-300/60 font-semibold">
                      0{index + 1}
                    </span>
                    <img
                      src={item.cover}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isCurrent ? "text-amber-300" : "text-amber-100"}`}>
                        {item.title}
                      </p>
                      <p className="text-[11px] text-amber-200/60 truncate">
                        {item.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-amber-300/60">
                      {formatTime(item.duration)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          onTogglePlay();
                        } else {
                          onTrackChange(item);
                        }
                      }}
                      className="w-7 h-7 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 flex items-center justify-center transition-all"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-amber-200" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-amber-200 ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
