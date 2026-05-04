import "dotenv/config";
import mongoose from "mongoose";
import Destination from "./models/Destination";
import Voyage from "./models/Voyage";

const destinations = [
  {
    name: "Greece",
    slug: "greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
  },
  {
    name: "Indonesia",
    slug: "indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
  },
  {
    name: "France",
    slug: "france",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
  },
  {
    name: "Japan",
    slug: "japan",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
  },
  {
    name: "Morocco",
    slug: "morocco",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800",
  },
  {
    name: "Switzerland",
    slug: "switzerland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  },
  {
    name: "Iceland",
    slug: "iceland",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800",
  },
];

const getVoyages = (destMap: Record<string, string>) => [
  {
    title: "Santorini Sunset Escape",
    slug: "santorini-sunset",
    price: 1480,
    duration: 7,
    rating: 4.9,
    reviewCount: 312,
    spotsLeft: 4,
    featured: true,
    destination: destMap["greece"],
    includes: [
      "Caldera-view suite",
      "Private catamaran cruise",
      "Wine tasting in Pyrgos",
      "Oia sunset dinner",
    ],
  },
  {
    title: "Bali Tropical Paradise",
    slug: "bali-tropical",
    price: 1290,
    duration: 10,
    rating: 4.8,
    reviewCount: 540,
    spotsLeft: 8,
    featured: true,
    destination: destMap["indonesia"],
    includes: ["Villa with infinity pool", "Cooking class", "Temple tour"],
  },
  {
    title: "Paris City of Lights",
    slug: "paris-city-lights",
    price: 1650,
    duration: 5,
    rating: 4.7,
    reviewCount: 421,
    spotsLeft: 6,
    featured: true,
    destination: destMap["france"],
    includes: [
      "Eiffel Tower dinner",
      "Louvre skip-the-line",
      "Seine river cruise",
    ],
  },
  {
    title: "Tokyo Neon Adventure",
    slug: "tokyo-neon",
    price: 2150,
    duration: 9,
    rating: 4.9,
    reviewCount: 287,
    spotsLeft: 3,
    featured: true,
    destination: destMap["japan"],
    includes: [
      "Shibuya crossing guide",
      "Tsukiji market tour",
      "TeamLab visit",
    ],
  },
  {
    title: "Marrakech Souk & Sahara",
    slug: "marrakech-sahara",
    price: 980,
    duration: 6,
    rating: 4.6,
    reviewCount: 198,
    spotsLeft: 7,
    featured: false,
    destination: destMap["morocco"],
    includes: ["Riad stay", "Sahara camel trek", "Hammam spa"],
  },
  {
    title: "Swiss Alps Lake Retreat",
    slug: "swiss-alps",
    price: 1890,
    duration: 8,
    rating: 4.9,
    reviewCount: 156,
    spotsLeft: 5,
    featured: false,
    destination: destMap["switzerland"],
    includes: [
      "Mountain chalet",
      "Paragliding session",
      "Cheese fondue evening",
    ],
  },
  {
    title: "Iceland Northern Lights",
    slug: "iceland-northern",
    price: 2380,
    duration: 6,
    rating: 5.0,
    reviewCount: 92,
    spotsLeft: 2,
    featured: false,
    destination: destMap["iceland"],
    includes: [
      "Northern lights tour",
      "Blue Lagoon access",
      "Golden Circle day trip",
    ],
  },
  {
    title: "Bali Wellness Retreat",
    slug: "bali-wellness",
    price: 1550,
    duration: 8,
    rating: 4.8,
    reviewCount: 211,
    spotsLeft: 9,
    featured: false,
    destination: destMap["indonesia"],
    includes: ["Daily yoga sessions", "Organic meal plan", "Spa treatments"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  await Destination.deleteMany({});
  await Voyage.deleteMany({});
  const dests = await Destination.insertMany(destinations);
  const destMap = Object.fromEntries(
    dests.map((d) => [d.slug, d._id.toString()]),
  );
  await Voyage.insertMany(
    getVoyages(destMap).map((v) => ({
      ...v,
      image: "",
      description: `Experience the best of ${v.title.split(" ")[0]}.`,
    })),
  );
  console.log("Seed complete — 7 destinations, 8 voyages added");
  await mongoose.disconnect();
}

seed().catch(console.error);
