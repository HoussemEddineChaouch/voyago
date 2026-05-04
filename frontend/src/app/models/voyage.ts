import { Destination } from './destination';

export interface Voyage {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  date: string;
  destination: Destination;
  image: string;
  rating: number;
  reviewCount: number;
  spotsLeft: number;
  includes: string[];
  featured: boolean;
}

export interface VoyagesResponse {
  voyages: Voyage[];
  total: number;
  pages: number;
}
