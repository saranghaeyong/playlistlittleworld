import lofiCoverImg from "../assets/images/anime_lofi_cover_1790070217144.jpg";
import summerTownImg from "../assets/images/anime_summer_town_1790070191781.jpg";
import trainStationImg from "../assets/images/anime_train_station_1790070204734.jpg";
import riversideImg from "../assets/images/anime_riverside_sunset_1790070237961.jpg";
import cinemaImg from "../assets/images/anime_cinema_night_1790070251240.jpg";
import { PlaylistItem } from "../types";

export const PLAYLIST: PlaylistItem[] = [
  {
    id: 1,
    title: "Summer Evening",
    japaneseTitle: "夏の夕暮れ",
    artist: "Aoi Nostalgia",
    audio: "/audio/summer-evening.mp3",
    cover: lofiCoverImg,
    duration: 184,
    tempo: 78,
    scale: ["C4", "E4", "G4", "B4", "D5", "A4", "F4", "C5"],
    description: "Gentle lo-fi chords with warm vinyl texture and a mellow Rhodes progression."
  },
  {
    id: 2,
    title: "Walking Home",
    japaneseTitle: "帰り道",
    artist: "Shio Kaze",
    audio: "/audio/walking-home.mp3",
    cover: summerTownImg,
    duration: 162,
    tempo: 82,
    scale: ["F4", "A4", "C5", "E5", "G4", "D5", "Bb4", "F5"],
    description: "Melodic guitar plucks mirroring the rhythmic footsteps of an evening stroll."
  },
  {
    id: 3,
    title: "Sakura Breeze",
    japaneseTitle: "桜のそよ風",
    artist: "Komorebi Duo",
    audio: "/audio/sakura-breeze.mp3",
    cover: riversideImg,
    duration: 198,
    tempo: 72,
    scale: ["G4", "B4", "D5", "F#5", "E5", "C5", "A4", "D5"],
    description: "Airy flute-like pads floating through late-summer nostalgia and cicada drones."
  },
  {
    id: 4,
    title: "Sunset Train",
    japaneseTitle: "夕焼け列車",
    artist: "Rail & Tape",
    audio: "/audio/sunset-train.mp3",
    cover: trainStationImg,
    duration: 210,
    tempo: 86,
    scale: ["D4", "F#4", "A4", "C#5", "B4", "G4", "E5", "A4"],
    description: "Hypnotic rhythmic pulses reminiscent of train tracks humming in the sunset."
  },
  {
    id: 5,
    title: "Night Lights",
    japaneseTitle: "街灯のあかり",
    artist: "Midnight Cicada",
    audio: "/audio/night-lights.mp3",
    cover: cinemaImg,
    duration: 175,
    tempo: 68,
    scale: ["A3", "C4", "E4", "G4", "B4", "F4", "D4", "A4"],
    description: "Soft ambient electric keys fading quietly into the starry Japanese night."
  }
];
