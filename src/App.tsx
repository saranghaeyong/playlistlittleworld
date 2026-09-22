import React, { useState, useEffect, useCallback } from "react";
import { LOCATIONS } from "./data/locations";
import { PLAYLIST } from "./data/playlist";
import { LocationData, PlaylistItem, ActivePanel } from "./types";
import { soundEngine } from "./utils/soundEngine";

import { World } from "./components/World";
import { Intro } from "./components/Intro";
import { MusicPlayer } from "./components/MusicPlayer";
import { LocationSelector } from "./components/LocationSelector";
import { ExplorePanel } from "./components/ExplorePanel";
import { InstagramPanel } from "./components/InstagramPanel";
import { PlaylistPanel } from "./components/PlaylistPanel";
import { AboutPanel } from "./components/AboutPanel";
import { AmbienceControl } from "./components/AmbienceControl";
import { Sun, Moon, Sparkles, Volume2 } from "lucide-react";

export default function App() {
  const [hasStartedWalk, setHasStartedWalk] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(LOCATIONS[0]);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [currentTrack, setCurrentTrack] = useState<PlaylistItem>(PLAYLIST[0]);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<"sunset" | "twilight" | "night">("sunset");

  // Sync state with soundEngine
  useEffect(() => {
    const unsub = soundEngine.subscribe(() => {
      const state = soundEngine.getState();
      setIsBgmPlaying(state.isBgmPlaying);
      setIsAmbiencePlaying(state.isAmbiencePlaying);
      if (state.currentTrack) {
        setCurrentTrack(state.currentTrack);
      }
    });
    return unsub;
  }, []);

  // Keyboard navigation & Escape to close panels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePanel(null);
      } else if (e.key === "ArrowRight" && !activePanel) {
        handleSwipeChangeLocation("left"); // next
      } else if (e.key === "ArrowLeft" && !activePanel) {
        handleSwipeChangeLocation("right"); // prev
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePanel, currentLocation]);

  // Start Walk handler from Intro
  const handleStartWalk = () => {
    setHasStartedWalk(true);
    // Start playback upon explicit user interaction
    soundEngine.playTrack(currentTrack);
    soundEngine.toggleAmbience();
    soundEngine.setAmbienceSound(currentLocation.ambientSound);
  };

  // Location change handler
  const handleSelectLocation = (loc: LocationData) => {
    setCurrentLocation(loc);
    setTimeOfDay(loc.timeOfDay);
    soundEngine.setAmbienceSound(loc.ambientSound);
  };

  // Swipe change handler
  const handleSwipeChangeLocation = (direction: "left" | "right") => {
    const currentIndex = LOCATIONS.findIndex((l) => l.id === currentLocation.id);
    if (direction === "left") {
      // next
      const nextIdx = (currentIndex + 1) % LOCATIONS.length;
      handleSelectLocation(LOCATIONS[nextIdx]);
    } else {
      // prev
      const prevIdx = (currentIndex - 1 + LOCATIONS.length) % LOCATIONS.length;
      handleSelectLocation(LOCATIONS[prevIdx]);
    }
  };

  // Cycle time of day easter egg
  const handleCycleTimeOfDay = () => {
    const times: ("sunset" | "twilight" | "night")[] = ["sunset", "twilight", "night"];
    const nextIdx = (times.indexOf(timeOfDay) + 1) % times.length;
    setTimeOfDay(times[nextIdx]);
  };

  // Music handlers
  const handleToggleBgm = () => {
    if (!hasStartedWalk) {
      setHasStartedWalk(true);
      soundEngine.playTrack(currentTrack);
    } else {
      soundEngine.toggleBgm();
    }
  };

  const handleNextTrack = () => {
    const idx = PLAYLIST.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = PLAYLIST[(idx + 1) % PLAYLIST.length];
    setCurrentTrack(nextTrack);
    soundEngine.playTrack(nextTrack);
  };

  const handleTrackChange = (track: PlaylistItem) => {
    setCurrentTrack(track);
    soundEngine.playTrack(track);
  };

  const handleToggleAmbience = () => {
    soundEngine.toggleAmbience();
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#161220] font-sans">
      {/* Subtle cinematic film grain overlay */}
      <div className="film-grain" />

      {/* Main Animated Anime World */}
      <World
        currentLocation={currentLocation}
        activePanel={activePanel}
        onOpenPanel={(p) => setActivePanel(p)}
        onSwipeChangeLocation={handleSwipeChangeLocation}
        onCycleTimeOfDay={handleCycleTimeOfDay}
        timeOfDay={timeOfDay}
      />

      {/* ------------------------------------------------------------ */}
      {/* SUBTLE TOP HEADER (Visible after start walk)                 */}
      {/* ------------------------------------------------------------ */}
      {hasStartedWalk && (
        <header className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none select-none">
          {/* Top-Left Logo & Subtitle */}
          <div
            id="brand-header"
            onClick={() => setActivePanel("about")}
            className="pointer-events-auto cursor-pointer group flex items-center gap-3 px-4 py-2 rounded-2xl glass-pill hover:border-amber-300/40 transition-all shadow-lg"
            title="About My Little World"
          >
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <div>
              <h1 className="text-xs sm:text-sm font-bold tracking-widest text-amber-100 group-hover:text-amber-300 transition-colors uppercase">
                MY LITTLE WORLD
              </h1>
              <p className="text-[10px] text-amber-200/60 tracking-wider font-medium">
                walk • listen • explore
              </p>
            </div>
          </div>

          {/* Top-Right Ambient and Time-of-Day Quick Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Quick Time of day switcher */}
            <button
              id="time-of-day-btn"
              onClick={handleCycleTimeOfDay}
              className="px-3 py-2 rounded-2xl glass-pill hover:border-amber-300/40 text-xs text-amber-200 font-medium transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
              title={`Current Time: ${timeOfDay.toUpperCase()} • Click to cycle`}
            >
              {timeOfDay === "sunset" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
              )}
              <span className="capitalize hidden sm:inline">{timeOfDay}</span>
            </button>

            {/* Dual Ambience / BGM Control Popover */}
            <AmbienceControl
              isBgmPlaying={isBgmPlaying}
              isAmbiencePlaying={isAmbiencePlaying}
              onToggleBgm={handleToggleBgm}
              onToggleAmbience={handleToggleAmbience}
            />
          </div>
        </header>
      )}

      {/* ------------------------------------------------------------ */}
      {/* FLOATING BGM PLAYER (Desktop bottom-left, Mobile bottom-center) */}
      {/* ------------------------------------------------------------ */}
      {hasStartedWalk && (
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isBgmPlaying}
          onTogglePlay={handleToggleBgm}
          onNextTrack={handleNextTrack}
          onOpenPlaylist={() => setActivePanel("playlist")}
        />
      )}

      {/* ------------------------------------------------------------ */}
      {/* LOCATION SELECTOR & INDICATOR (Bottom-right: 01 / 06)         */}
      {/* ------------------------------------------------------------ */}
      {hasStartedWalk && (
        <LocationSelector
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          onOpenExplore={() => setActivePanel("explore")}
        />
      )}

      {/* ------------------------------------------------------------ */}
      {/* INTRO SCREEN (Modal on first open)                           */}
      {/* ------------------------------------------------------------ */}
      {!hasStartedWalk && <Intro onStart={handleStartWalk} />}

      {/* ------------------------------------------------------------ */}
      {/* MODAL PANELS                                                 */}
      {/* ------------------------------------------------------------ */}
      {activePanel === "explore" && (
        <ExplorePanel
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === "instagram" && (
        <InstagramPanel onClose={() => setActivePanel(null)} />
      )}

      {activePanel === "playlist" && (
        <PlaylistPanel
          currentTrack={currentTrack}
          isPlaying={isBgmPlaying}
          onTrackChange={handleTrackChange}
          onTogglePlay={handleToggleBgm}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === "bgm" && (
        <PlaylistPanel
          currentTrack={currentTrack}
          isPlaying={isBgmPlaying}
          onTrackChange={handleTrackChange}
          onTogglePlay={handleToggleBgm}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === "about" && (
        <AboutPanel onClose={() => setActivePanel(null)} />
      )}
    </main>
  );
}
