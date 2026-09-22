export type LocationId = string;

export interface LocationData {
  id: string;
  name: string;
  japaneseName: string;
  background: string;
  description: string;
  mood: string;
  timeOfDay: "sunset" | "twilight" | "night";
  ambientSound: "cicadas" | "wind" | "birds" | "rain";
  quote: string;
}

export interface PlaylistItem {
  id: number;
  title: string;
  japaneseTitle?: string;
  artist: string;
  audio: string;
  cover: string;
  duration: number;
  tempo?: number;
  scale?: string[];
  chords?: string[];
  description?: string;
}

export type AmbienceSoundType = "cicadas" | "wind" | "birds" | "rain";

export type ActivePanel = null | "explore" | "instagram" | "playlist" | "bgm" | "about";
