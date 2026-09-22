import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  Camera,
  Radio,
  Music,
  Home,
  Sun,
  Moon,
  Sparkles,
  Train,
  Volume2
} from "lucide-react";
import { LocationData, ActivePanel } from "../types";
import { Character } from "./Character";
import { soundEngine } from "../utils/soundEngine";

interface WorldProps {
  currentLocation: LocationData;
  activePanel: ActivePanel;
  onOpenPanel: (panel: ActivePanel) => void;
  onSwipeChangeLocation: (direction: "left" | "right") => void;
  onCycleTimeOfDay: () => void;
  timeOfDay: "sunset" | "twilight" | "night";
}

export const World: React.FC<WorldProps> = ({
  currentLocation,
  activePanel,
  onOpenPanel,
  onSwipeChangeLocation,
  onCycleTimeOfDay,
  timeOfDay
}) => {
  // Mouse Parallax Offsets
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Easter eggs states
  const [catState, setCatState] = useState<"idle" | "stretching" | "purring">("idle");
  const [catPurrText, setCatPurrText] = useState<string | null>(null);
  const [vendingMachineGlow, setVendingMachineGlow] = useState<number>(0);
  const [isTrainRunning, setIsTrainRunning] = useState(false);
  const [lanternGlow, setLanternGlow] = useState(true);

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe threshold
    if (Math.abs(diffX) > 48 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        onSwipeChangeLocation("right"); // previous
      } else {
        onSwipeChangeLocation("left"); // next
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Easter egg: Click Cat
  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatMeow();
    setCatState("stretching");
    const meows = ["Nyaa~", "Purrrr...", "Mrrrow? ✨", "Mew!"];
    setCatPurrText(meows[Math.floor(Math.random() * meows.length)]);
    setTimeout(() => {
      setCatState("idle");
      setCatPurrText(null);
    }, 2800);
  };

  // Easter egg: Click Vending Machine
  const handleVendingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCanClick();
    setVendingMachineGlow((prev) => (prev + 1) % 4);
  };

  // Easter egg: Click Train / Railway
  const handleTrainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTrainRunning) return;
    soundEngine.playTrainBell();
    setIsTrainRunning(true);
    setTimeout(() => setIsTrainRunning(false), 12000);
  };

  // Easter egg: Wind chime on porch
  const handleWindChimeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playWindChime();
  };

  // Sky color schemes based on timeOfDay
  const skyGradients = {
    sunset: "from-[#2b2b52] via-[#e56b55] to-[#fbc531]",
    twilight: "from-[#130f40] via-[#4834d4] to-[#ea8685]",
    night: "from-[#080710] via-[#10142e] to-[#1c234a]"
  };

  const sunMoonGradients = {
    sunset: {
      color: "from-amber-200 via-orange-400 to-rose-500",
      glow: "rgba(251, 197, 49, 0.45)",
      isMoon: false
    },
    twilight: {
      color: "from-amber-100 via-pink-200 to-indigo-300",
      glow: "rgba(234, 134, 133, 0.35)",
      isMoon: true
    },
    night: {
      color: "from-amber-100 via-slate-100 to-blue-200",
      glow: "rgba(224, 231, 255, 0.4)",
      isMoon: true
    }
  };

  const currentSunMoon = sunMoonGradients[timeOfDay];

  // Vending machine glow colors
  const vendingColors = ["#00a8ff", "#e056fd", "#f0932b", "#6ab04c"];

  return (
    <div
      ref={containerRef}
      id="anime-world-viewport"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* ============================================================ */}
      {/* LAYER 1: SKY & CELESTIAL BACKGROUND (Parallax 0.15x)          */}
      {/* ============================================================ */}
      <div
        id="parallax-sky-layer"
        className={`absolute inset-0 bg-gradient-to-b ${skyGradients[timeOfDay]} transition-colors duration-1000`}
        style={{
          transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * 3}px, 0)`
        }}
      >
        {/* Soft Sun / Twilight Moon (Clickable easter egg to toggle time of day!) */}
        <div
          id="celestial-body"
          onClick={onCycleTimeOfDay}
          className="absolute top-12 right-12 sm:right-24 cursor-pointer group z-10 transition-all duration-700"
          title={`Current: ${timeOfDay.toUpperCase()} • Click to cycle time of day!`}
        >
          <div
            className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr ${currentSunMoon.color} shadow-2xl transition-all duration-700 group-hover:scale-110`}
            style={{
              boxShadow: `0 0 70px 20px ${currentSunMoon.glow}`
            }}
          >
            {currentSunMoon.isMoon && (
              <div className="absolute top-2 right-2 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-black/15 filter blur-[2px]" />
            )}
          </div>
          {/* Subtle tooltip hint */}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-amber-200/60 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
            Click to change time ({timeOfDay})
          </span>
        </div>

        {/* Twinkling stars for twilight and night */}
        {timeOfDay !== "sunset" && (
          <div className="absolute inset-0 pointer-events-none opacity-80">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-amber-100 animate-pulse"
                style={{
                  top: `${(i * 17) % 55}%`,
                  left: `${(i * 23) % 95}%`,
                  width: `${(i % 3) + 1.5}px`,
                  height: `${(i % 3) + 1.5}px`,
                  animationDuration: `${2 + (i % 4)}s`,
                  animationDelay: `${(i * 0.4) % 3}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Drifting Cumulus Clouds (Nyuudougumo) */}
        <div
          className="absolute top-1/4 -left-[20%] w-[180%] h-48 pointer-events-none opacity-45 animate-cloud-slow"
        >
          <svg viewBox="0 0 1600 200" className="w-full h-full fill-amber-100/40 drop-shadow-sm">
            <path d="M0 160 Q120 80 260 120 Q380 40 520 100 Q680 20 840 110 Q980 60 1140 120 Q1300 40 1460 100 Q1560 70 1600 120 L1600 200 L0 200 Z" />
          </svg>
        </div>

        <div
          className="absolute top-1/3 -left-[10%] w-[160%] h-40 pointer-events-none opacity-50 animate-cloud-medium"
        >
          <svg viewBox="0 0 1600 200" className="w-full h-full fill-amber-200/35">
            <path d="M0 140 Q180 50 360 110 Q540 20 720 90 Q900 30 1080 100 Q1260 40 1440 110 L1600 150 L1600 200 L0 200 Z" />
          </svg>
        </div>

        {/* Gliding Sparrows/Birds */}
        <div className="animate-bird-flight pointer-events-none absolute">
          <svg width="28" height="18" viewBox="0 0 32 16" className="fill-amber-950/70">
            <path d="M0 8 Q8 0 16 8 Q24 0 32 8 Q24 5 16 10 Q8 5 0 8 Z" />
          </svg>
        </div>
        <div className="animate-bird-flight-slow pointer-events-none absolute">
          <svg width="22" height="14" viewBox="0 0 32 16" className="fill-amber-950/60">
            <path d="M0 8 Q8 0 16 8 Q24 0 32 8 Q24 5 16 10 Q8 5 0 8 Z" />
          </svg>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LAYER 2: DISTANT MOUNTAINS & TRAIN TRACKS (Parallax 0.25x)    */}
      {/* ============================================================ */}
      <div
        id="parallax-distant-mountains"
        className="absolute inset-0 pointer-events-none transition-transform duration-300"
        style={{
          transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 6}px, 0)`
        }}
      >
        {/* Distant Mountain Ridges */}
        <div className="absolute bottom-[35%] w-full h-44 pointer-events-none">
          <svg viewBox="0 0 1440 220" className="w-full h-full preserve-3d" preserveAspectRatio="none">
            {/* Back Mountain ridge */}
            <path
              d="M0 140 Q160 50 380 110 Q580 30 820 95 Q1060 20 1280 85 Q1380 60 1440 90 L1440 220 L0 220 Z"
              fill={timeOfDay === "night" ? "#12152b" : "#6a3861"}
              opacity="0.65"
            />
            {/* Mid Mountain ridge */}
            <path
              d="M0 160 Q220 80 460 130 Q700 65 960 120 Q1200 70 1440 125 L1440 220 L0 220 Z"
              fill={timeOfDay === "night" ? "#161b36" : "#4c2859"}
              opacity="0.85"
            />
          </svg>
        </div>

        {/* Distant Railway Line & Train (Clickable Easter Egg!) */}
        <div
          id="distant-train-track"
          onClick={handleTrainClick}
          className="absolute bottom-[36%] left-0 right-0 h-8 pointer-events-auto cursor-pointer group"
          title="Click to hear and watch the sunset train"
        >
          {/* Rail line silhouette */}
          <div className="w-full h-[2px] bg-amber-950/50 absolute bottom-1" />

          {/* Running Train Animation */}
          <div
            className={`absolute bottom-1 right-0 flex items-end ${
              isTrainRunning ? "animate-train-running" : "opacity-0"
            }`}
          >
            {/* Two-car local commuter train */}
            <div className="flex gap-1">
              <div className="w-20 h-6 bg-amber-200/90 rounded-t-md border-b-2 border-orange-500 shadow-md flex items-center justify-around px-1">
                <div className="w-2.5 h-2 bg-amber-950/80 rounded-sm" />
                <div className="w-2.5 h-2 bg-amber-950/80 rounded-sm" />
                <div className="w-2.5 h-2 bg-amber-950/80 rounded-sm" />
                <div className="w-2.5 h-2 bg-amber-400 rounded-sm" />
              </div>
              <div className="w-20 h-6 bg-amber-200/90 rounded-t-md border-b-2 border-orange-500 shadow-md flex items-center justify-around px-1">
                <div className="w-2.5 h-2 bg-amber-950/80 rounded-sm" />
                <div className="w-2.5 h-2 bg-amber-950/80 rounded-sm" />
                <div className="w-2.5 h-2 bg-amber-950/80 rounded-sm" />
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LAYER 3: MIDDLE GROUND - HOUSES, SHOPS, UTILITY POLES (0.5x) */}
      {/* ============================================================ */}
      <div
        id="parallax-middle-ground"
        className="absolute inset-0 transition-transform duration-200"
        style={{
          transform: `translate3d(${mouseOffset.x * 24}px, ${mouseOffset.y * 12}px, 0)`
        }}
      >
        {/* Japanese Town Skyline & Rooftops */}
        <div className="absolute bottom-[20%] left-0 right-0 h-64 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            {/* Roof tiles & residential silhouettes */}
            <path
              d="M0 190 L60 175 L120 190 L120 320 L0 320 Z
                 M120 180 L220 150 L320 180 L320 320 L120 320 Z
                 M340 210 L440 180 L540 210 L540 320 L340 320 Z
                 M550 170 L680 140 L810 170 L810 320 L550 320 Z
                 M820 195 L950 160 L1080 195 L1080 320 L820 320 Z
                 M1090 175 L1220 145 L1350 175 L1350 320 L1090 320 Z
                 M1350 190 L1440 175 L1440 320 L1350 320 Z"
              fill={timeOfDay === "night" ? "#0f1325" : "#321e3f"}
            />
          </svg>
        </div>

        {/* Iconic Japanese Utility Poles & Power Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 1440 800" className="w-full h-full" preserveAspectRatio="none">
            {/* Left utility pole */}
            <rect x="220" y="80" width="10" height="620" fill="#1e1828" />
            <rect x="180" y="110" width="90" height="6" fill="#2d243a" />
            <rect x="195" y="140" width="60" height="5" fill="#2d243a" />
            <rect x="232" y="160" width="14" height="26" rx="2" fill="#3b3149" /> {/* Transformer */}

            {/* Right utility pole */}
            <rect x="1140" y="60" width="12" height="640" fill="#1e1828" />
            <rect x="1100" y="90" width="92" height="6" fill="#2d243a" />
            <rect x="1115" y="120" width="62" height="5" fill="#2d243a" />

            {/* Power lines cutting across the sky */}
            <path d="M-10 112 Q650 210 1450 92" stroke="#1c1626" strokeWidth="1.8" fill="none" opacity="0.8" />
            <path d="M-10 135 Q660 235 1450 115" stroke="#1c1626" strokeWidth="1.5" fill="none" opacity="0.75" />
            <path d="M225 145 Q680 270 1145 125" stroke="#1c1626" strokeWidth="1.6" fill="none" opacity="0.8" />
            <path d="M225 175 Q690 300 1145 155" stroke="#1c1626" strokeWidth="1.2" fill="none" opacity="0.65" />
          </svg>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* INTERACTIVE IN-WORLD HOTSPOTS                                */}
        {/* ------------------------------------------------------------ */}

        {/* 1. Signboard → "EXPLORE" */}
        <div
          id="hotspot-explore-signboard"
          onClick={() => onOpenPanel("explore")}
          className="absolute bottom-[24%] left-[10%] sm:left-[14%] z-30 cursor-pointer group animate-sign"
          title="Town Signpost • Explore different locations"
        >
          <div className="relative flex flex-col items-center">
            {/* Hanging signboard */}
            <div className="px-3 sm:px-4 py-2 rounded-xl bg-amber-900/85 hover:bg-amber-800 text-amber-100 border border-amber-300/40 shadow-xl backdrop-blur-sm transition-all group-hover:scale-105 group-hover:border-amber-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
              <div className="text-left">
                <div className="text-[11px] font-bold tracking-wider uppercase text-amber-200">
                  EXPLORE
                </div>
                <div className="text-[9px] text-amber-300/70">町を巡る</div>
              </div>
            </div>
            {/* Wooden post */}
            <div className="w-2.5 h-16 bg-amber-950 border-r border-amber-900/40" />
          </div>
        </div>

        {/* 2. Poster on telephone pole → "INSTAGRAM" */}
        <div
          id="hotspot-instagram-poster"
          onClick={() => onOpenPanel("instagram")}
          className="absolute bottom-[28%] left-[24%] sm:left-[22%] z-30 cursor-pointer group"
          title="Photo Poster • Visit Instagram profile"
        >
          <div className="px-2.5 py-2 rounded-lg bg-pink-950/80 hover:bg-pink-900/90 text-pink-100 border border-pink-400/40 shadow-xl backdrop-blur-sm transition-all group-hover:scale-105 group-hover:border-pink-300 flex items-center gap-1.5 rotate-[-2deg]">
            <Camera className="w-3.5 h-3.5 text-pink-300" />
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-wider text-pink-200">
                INSTAGRAM
              </div>
              <div className="text-[8px] text-pink-300/70">写真集</div>
            </div>
          </div>
        </div>

        {/* 3. Cassette Tape on Bench → "PLAYLIST" */}
        <div
          id="hotspot-playlist-cassette"
          onClick={() => onOpenPanel("playlist")}
          className="absolute bottom-[23%] left-[45%] sm:left-[48%] z-30 cursor-pointer group"
          title="Summer Cassette • Open Music Playlist"
        >
          <div className="px-3 py-1.5 rounded-xl bg-[#231d30]/90 hover:bg-[#2e2640] text-amber-100 border border-amber-400/40 shadow-xl backdrop-blur-sm transition-all group-hover:scale-105 group-hover:border-amber-300 flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-300" />
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-wider uppercase text-amber-200">
                PLAYLIST
              </div>
              <div className="text-[8px] text-amber-300/70">カセットテープ</div>
            </div>
          </div>
        </div>

        {/* 4. Transistor Radio → "BGM" */}
        <div
          id="hotspot-bgm-radio"
          onClick={() => onOpenPanel("bgm")}
          className="absolute bottom-[23%] right-[28%] sm:right-[32%] z-30 cursor-pointer group"
          title="Vintage Radio • Music controls"
        >
          <div className="px-3 py-1.5 rounded-xl bg-orange-950/85 hover:bg-orange-900 text-orange-100 border border-orange-400/40 shadow-xl backdrop-blur-sm transition-all group-hover:scale-105 group-hover:border-orange-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-300" />
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-wider uppercase text-orange-200">
                BGM
              </div>
              <div className="text-[8px] text-orange-300/70">レトロラジオ</div>
            </div>
          </div>
        </div>

        {/* 5. House Window / Porch → "ABOUT" */}
        <div
          id="hotspot-about-house"
          onClick={() => onOpenPanel("about")}
          className="absolute bottom-[25%] right-[8%] sm:right-[12%] z-30 cursor-pointer group"
          title="Cozy House Window • About this little world"
        >
          <div className="relative flex flex-col items-center">
            <div className="px-3 sm:px-4 py-2 rounded-xl bg-indigo-950/85 hover:bg-indigo-900 text-indigo-100 border border-indigo-300/40 shadow-xl backdrop-blur-sm transition-all group-hover:scale-105 group-hover:border-amber-300 flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-300" />
              <div className="text-left">
                <div className="text-[11px] font-bold tracking-wider uppercase text-amber-100">
                  ABOUT
                </div>
                <div className="text-[9px] text-amber-300/70">小さな家</div>
              </div>
            </div>
            {/* Wind chime hanging beneath window (clickable easter egg!) */}
            <div
              onClick={handleWindChimeClick}
              className="mt-1 cursor-pointer hover:scale-110 transition-transform"
              title="Click the wind chime"
            >
              <div className="w-2 h-2 rounded-full bg-amber-300 mx-auto" />
              <div className="w-0.5 h-6 bg-white/40 mx-auto" />
              <div className="w-2 h-5 bg-amber-100/70 rounded-xs mx-auto shadow-xs" />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* EASTER EGGS: CAT & VENDING MACHINE                           */}
        {/* ------------------------------------------------------------ */}

        {/* Cozy Stray Cat on Stone Wall */}
        <div
          id="easter-egg-cat"
          onClick={handleCatClick}
          className="absolute bottom-[17%] left-[34%] z-25 cursor-pointer group"
          title="Click the neighborhood cat"
        >
          {catPurrText && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-900/90 text-amber-100 text-[10px] px-2 py-1 rounded-full border border-amber-300/40 shadow-md animate-bounce">
              {catPurrText}
            </div>
          )}

          {/* Illustrated SVG Cat */}
          <div
            className={`w-10 h-8 transition-transform duration-300 ${
              catState === "stretching" ? "scale-x-110 -translate-y-1" : "group-hover:scale-105"
            }`}
          >
            <svg viewBox="0 0 48 36" className="w-full h-full drop-shadow-md">
              {/* Sleeping/curled cat body */}
              <ellipse cx="24" cy="22" rx="16" ry="10" fill="#f59e0b" />
              {/* Calico patches */}
              <ellipse cx="20" cy="19" rx="8" ry="5" fill="#78350f" />
              <ellipse cx="30" cy="23" rx="5" ry="4" fill="#ffffff" />
              {/* Head */}
              <circle cx="36" cy="16" r="7" fill="#f59e0b" />
              {/* Ears */}
              <polygon points="32,11 35,5 37,11" fill="#78350f" />
              <polygon points="38,11 41,5 43,11" fill="#f59e0b" />
              {/* Curled Tail */}
              <path
                d="M10 24 Q4 18 8 12"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Japanese Vending Machine (Jidouhanbaiki) */}
        <div
          id="easter-egg-vending-machine"
          onClick={handleVendingClick}
          className="absolute bottom-[18%] right-[22%] z-25 cursor-pointer group"
          title="Click the vending machine to change drink lights & hear a can drop!"
        >
          <div className="w-14 h-24 sm:w-16 sm:h-28 rounded-md bg-[#1a233a] border-2 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col justify-between p-1.5 transition-all group-hover:scale-105">
            {/* Illuminated beverage display rows */}
            <div
              className="w-full h-12 rounded-xs border border-white/20 p-1 flex flex-col justify-around transition-all"
              style={{
                backgroundColor: vendingColors[vendingMachineGlow],
                boxShadow: `0 0 16px ${vendingColors[vendingMachineGlow]}88`
              }}
            >
              <div className="flex justify-around items-center">
                <span className="w-1.5 h-3 bg-red-500 rounded-xs shadow-xs" />
                <span className="w-1.5 h-3 bg-blue-400 rounded-xs shadow-xs" />
                <span className="w-1.5 h-3 bg-emerald-400 rounded-xs shadow-xs" />
                <span className="w-1.5 h-3 bg-amber-300 rounded-xs shadow-xs" />
              </div>
              <div className="flex justify-around items-center">
                <span className="w-1.5 h-3 bg-cyan-300 rounded-xs shadow-xs" />
                <span className="w-1.5 h-3 bg-yellow-400 rounded-xs shadow-xs" />
                <span className="w-1.5 h-3 bg-rose-400 rounded-xs shadow-xs" />
                <span className="w-1.5 h-3 bg-purple-400 rounded-xs shadow-xs" />
              </div>
            </div>

            {/* Coin slot & Can delivery tray */}
            <div className="flex items-center justify-between px-1">
              <span className="w-2 h-0.5 bg-red-400" />
              <span className="w-3 h-1 bg-amber-400 animate-pulse" />
            </div>

            {/* Dispenser tray flap */}
            <div className="w-full h-4 bg-slate-900 rounded-xs border border-slate-700 flex items-center justify-center">
              <span className="w-6 h-0.5 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Walking Anime Character */}
        <Character onInteract={() => soundEngine.playWindChime()} />
      </div>

      {/* ============================================================ */}
      {/* LAYER 4: FOREGROUND - ROAD, SIDEWALK, FOLIAGE (1.0x)         */}
      {/* ============================================================ */}
      <div
        id="parallax-foreground"
        className="absolute inset-0 pointer-events-none transition-transform duration-100"
        style={{
          transform: `translate3d(${mouseOffset.x * 42}px, ${mouseOffset.y * 18}px, 0)`
        }}
      >
        {/* Asphalt Road & Sidewalk */}
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t from-[#140e1d] via-[#1f172c] to-[#2b203c] border-t-2 border-amber-300/20 shadow-inner">
          {/* Sidewalk curb & yellow tactile blocks */}
          <div className="w-full h-4 bg-[#2f2442] border-b border-[#1b1427] flex items-center px-4 gap-4">
            <div className="w-16 h-1.5 bg-amber-400/50 rounded-xs" />
            <div className="w-16 h-1.5 bg-amber-400/50 rounded-xs" />
            <div className="w-16 h-1.5 bg-amber-400/50 rounded-xs" />
          </div>

          {/* Road white line dashes */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-around opacity-40">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-14 h-2 bg-amber-100/70 rounded-full" />
            ))}
          </div>
        </div>

        {/* Foreground swaying summer foliage & flowers */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none flex justify-between items-end overflow-hidden">
          {/* Left flower & grass cluster */}
          <div className="animate-foliage origin-bottom-left w-48 sm:w-64 h-28 -ml-4">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <path d="M0 100 Q30 40 50 10 Q70 50 90 100 Z" fill="#1b2a26" />
              <path d="M40 100 Q60 30 80 15 Q100 60 120 100 Z" fill="#2d4a3e" />
              <path d="M80 100 Q110 20 130 5 Q150 40 170 100 Z" fill="#1b2a26" />
              {/* Hydrangea blossoms */}
              <circle cx="50" cy="20" r="10" fill="#60a5fa" opacity="0.8" />
              <circle cx="56" cy="16" r="7" fill="#a78bfa" opacity="0.8" />
              <circle cx="126" cy="30" r="11" fill="#ec4899" opacity="0.75" />
            </svg>
          </div>

          {/* Right flower & grass cluster */}
          <div className="animate-foliage-reverse origin-bottom-right w-48 sm:w-64 h-28 -mr-4">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <path d="M200 100 Q170 40 150 10 Q130 50 110 100 Z" fill="#1b2a26" />
              <path d="M160 100 Q140 30 120 15 Q100 60 80 100 Z" fill="#2d4a3e" />
              <circle cx="150" cy="22" r="10" fill="#60a5fa" opacity="0.8" />
              <circle cx="140" cy="26" r="8" fill="#c084fc" opacity="0.8" />
            </svg>
          </div>
        </div>

        {/* Ambient floating particles (Golden dust in sunset / Fireflies in twilight & night) */}
        <div className="absolute inset-0 pointer-events-none">
          {timeOfDay === "sunset" ? (
            // Golden summer pollen / sakura dust motes
            [...Array(14)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-amber-300/60 blur-[0.5px]"
                style={{
                  top: `${(i * 19 + 20) % 85}%`,
                  left: `${(i * 23) % 92}%`,
                  width: `${(i % 3) + 3}px`,
                  height: `${(i % 3) + 3}px`,
                  animation: `floatParticle ${14 + (i % 8)}s ease-in-out infinite ${(i * 1.5) % 6}s`
                }}
              />
            ))
          ) : (
            // Glowing evening fireflies (Hotaru)
            [...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-yellow-300 animate-firefly"
                style={{
                  bottom: `${15 + ((i * 11) % 45)}%`,
                  left: `${(i * 13 + 5) % 92}%`,
                  width: "5px",
                  height: "5px",
                  animationDuration: `${2.8 + (i % 3)}s`,
                  animationDelay: `${(i * 0.7) % 4}s`
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
