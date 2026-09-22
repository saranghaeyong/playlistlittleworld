import React, { useState } from "react";

interface CharacterProps {
  onInteract?: () => void;
}

const DIALOGUES = [
  "Such a warm, quiet evening...",
  "The cicadas are singing so peacefully today.",
  "Look at that golden sky...",
  "I wonder where this path leads.",
  "Taking a slow walk is the best part of summer.",
  "The evening breeze feels so nice."
];

export const Character: React.FC<CharacterProps> = ({ onInteract }) => {
  const [speech, setSpeech] = useState<string | null>(null);
  const [isWaving, setIsWaving] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWaving(true);
    const randomMsg = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
    setSpeech(randomMsg);
    onInteract?.();
    setTimeout(() => setSpeech(null), 4200);
    setTimeout(() => setIsWaving(false), 2400);
  };

  return (
    <div
      id="anime-character-container"
      className="absolute bottom-14 md:bottom-20 z-25 pointer-events-auto cursor-pointer select-none group"
      style={{
        animation: "characterWalkAcross 54s linear infinite",
        transition: "opacity 0.5s ease"
      }}
      onClick={handleClick}
      title="Click the traveler to say hello"
    >
      {/* Speech bubble */}
      {speech && (
        <div
          id="character-speech-bubble"
          className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-950/90 text-amber-100 text-xs px-3 py-1.5 rounded-full border border-amber-300/30 shadow-lg pointer-events-none transition-all animate-bounce"
        >
          {speech}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-950/90 rotate-45 border-r border-b border-amber-300/30" />
        </div>
      )}

      {/* Walking Character SVG Illustration */}
      <div className="relative w-16 h-28 md:w-20 md:h-32 transform transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 100 160"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow on ground */}
          <ellipse
            cx="50"
            cy="152"
            rx="24"
            ry="6"
            fill="#120c1a"
            opacity="0.5"
            className="group-hover:opacity-70 transition-opacity"
          />

          <g style={{ animation: "walkBob 0.8s ease-in-out infinite" }}>
            {/* Back Leg */}
            <g
              style={{
                transformOrigin: "46px 115px",
                animation: "legSwingBack 0.8s ease-in-out infinite"
              }}
            >
              <rect x="42" y="112" width="9" height="24" rx="4" fill="#39424e" />
              <ellipse cx="46" cy="142" rx="7" ry="5" fill="#f8fafc" />
              <path d="M42 144 H54 V147 H42 Z" fill="#b91c1c" />
            </g>

            {/* Back Arm & Strap */}
            <g
              style={{
                transformOrigin: "52px 64px",
                animation: isWaving ? "none" : "armSwingBack 0.8s ease-in-out infinite"
              }}
            >
              <rect x="52" y="62" width="7" height="22" rx="3.5" fill="#fbcfe8" />
              <circle cx="55" cy="88" r="4" fill="#fed7aa" />
            </g>

            {/* Backpack */}
            <rect x="30" y="60" width="16" height="26" rx="5" fill="#ca8a04" />
            <path d="M33 66 H43" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            <circle cx="38" cy="76" r="2.5" fill="#fef08a" />

            {/* Torso & Shirt */}
            <path
              d="M40 58 C40 54 44 52 50 52 C56 52 60 54 60 58 L62 90 C62 93 58 95 50 95 C42 95 38 93 38 90 Z"
              fill="#fffbeb"
            />
            {/* Pastel vest / overall */}
            <path
              d="M41 72 L41 94 C41 96 46 97 50 97 C54 97 59 96 59 94 L59 72 Z"
              fill="#0284c7"
            />
            {/* Belt & pouch */}
            <rect x="42" y="93" width="16" height="3" fill="#475569" />

            {/* Front Leg */}
            <g
              style={{
                transformOrigin: "54px 115px",
                animation: "legSwingFront 0.8s ease-in-out infinite"
              }}
            >
              <rect x="50" y="112" width="9" height="24" rx="4" fill="#1e293b" />
              <ellipse cx="54" cy="142" rx="7" ry="5" fill="#f8fafc" />
              <path d="M50 144 H62 V147 H50 Z" fill="#b91c1c" />
            </g>

            {/* Neck & Head */}
            <rect x="47" y="44" width="6" height="10" rx="3" fill="#fed7aa" />
            <circle cx="50" cy="38" r="14" fill="#fed7aa" />

            {/* Anime Hair (Soft dark brown/navy) */}
            <path
              d="M36 36 C36 22 64 22 64 36 C64 42 63 45 61 46 C58 40 58 35 52 35 C46 35 44 42 39 46 Z"
              fill="#1e1b4b"
            />
            {/* Little face blush & eye */}
            <ellipse cx="56" cy="39" rx="1.8" ry="2.2" fill="#1e1b4b" />
            <ellipse cx="57.5" cy="42" rx="2.5" ry="1.2" fill="#f87171" opacity="0.6" />

            {/* Summer Straw Hat (Mugiwara) */}
            <ellipse cx="50" cy="24" rx="25" ry="6.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <path
              d="M38 24 C38 15 62 15 62 24"
              fill="#fde047"
              stroke="#ca8a04"
              strokeWidth="1"
            />
            {/* Red ribbon band on hat */}
            <path d="M38 23 Q50 25 62 23" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />
            {/* Trailing hat ribbon in the breeze */}
            <path
              d="M38 24 Q30 28 26 36 Q22 40 20 48"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Front Arm (Swinging or Waving) */}
            <g
              style={{
                transformOrigin: "48px 62px",
                animation: isWaving
                  ? "armSwingFront 0.3s ease-in-out infinite"
                  : "armSwingFront 0.8s ease-in-out infinite"
              }}
            >
              <rect x="45" y="60" width="7" height="24" rx="3.5" fill="#fffbeb" />
              {/* Forearm & hand */}
              <rect x="46" y="80" width="5.5" height="12" rx="2.5" fill="#fed7aa" />
              <circle cx="48.5" cy="94" r="3.5" fill="#fed7aa" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
