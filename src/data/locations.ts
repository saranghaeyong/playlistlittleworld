import summerTownImg from "../assets/images/anime_summer_town_1790070191781.jpg";
import trainStationImg from "../assets/images/anime_train_station_1790070204734.jpg";
import riversideImg from "../assets/images/anime_riverside_sunset_1790070237961.jpg";
import cinemaImg from "../assets/images/anime_cinema_night_1790070251240.jpg";
import { LocationData } from "../types";

export const LOCATIONS: LocationData[] = [
  {
    id: "street",
    name: "Summer Street",
    japaneseName: "夏の街並み",
    background: summerTownImg,
    description: "A quiet residential street bathed in the golden warmth of late afternoon. Power lines crisscross the amber sky as swallows glide by.",
    mood: "Golden Hour Nostalgia",
    timeOfDay: "sunset",
    ambientSound: "cicadas",
    quote: "The warmth of tarmac and the smell of evening dinners beginning to cook."
  },
  {
    id: "arcade",
    name: "Corner Store & Arcade",
    japaneseName: "商店街と自販機",
    background: summerTownImg,
    description: "The retro neighborhood arcade and bright blue vending machines. A bicycle leans quietly against the weathered shop wall.",
    mood: "Neighborhood Calm",
    timeOfDay: "sunset",
    ambientSound: "wind",
    quote: "A cold ramune bottle clinking in the vending machine tray."
  },
  {
    id: "park",
    name: "Green Hydrangea Park",
    japaneseName: "紫陽花の公園",
    background: riversideImg,
    description: "Deep green leaves rustling beneath a gentle breeze. Clustered blue hydrangeas catching the last rays of amber sunlight.",
    mood: "Gentle Wind & Leaves",
    timeOfDay: "sunset",
    ambientSound: "birds",
    quote: "Dappled sunlight dancing across a wooden bench under the elm trees."
  },
  {
    id: "station",
    name: "Rural Train Crossing",
    japaneseName: "夕暮れの踏切",
    background: trainStationImg,
    description: "A peaceful level crossing on the edge of town. Giant summer cumulus clouds tower in the distance as the signal bell rings softly.",
    mood: "Railway Reverie",
    timeOfDay: "sunset",
    ambientSound: "wind",
    quote: "Waiting for the two-car local train to pass into the orange haze."
  },
  {
    id: "riverside",
    name: "Sunset Riverbank",
    japaneseName: "夕焼けの土手",
    background: riversideImg,
    description: "Tall grass swaying on the river embankment. The calm water mirrors the gradient of violet, peach, and burning gold.",
    mood: "River Reflections",
    timeOfDay: "twilight",
    ambientSound: "cicadas",
    quote: "Pedaling home along the embankment as early fireflies begin to glow."
  },
  {
    id: "cinema",
    name: "Retro Cinema",
    japaneseName: "黄昏のレトロ映画館",
    background: cinemaImg,
    description: "A nostalgic single-screen cinema on the quiet corner. Warm neon glow reflecting softly on twilight streets as stars appear.",
    mood: "Starlight Twilight",
    timeOfDay: "night",
    ambientSound: "rain",
    quote: "Vintage movie posters and the peaceful hum of projector lamps."
  }
];
