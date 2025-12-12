// Location Types

export interface Location {
  id: string;
  
  // Basic Info
  name: string;
  nameLocal?: string;
  description: string;
  descriptionShort: string;
  
  // Coordinates
  googlePlaceId?: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  
  // Categorization
  category: LocationCategory;
  subcategory?: string;
  tags: string[];
  
  // Media
  imageUrl: string;
  images: string[];
  
  // Metadata
  priceLevel: 1 | 2 | 3 | 4;
  rating: number;
  reviewCount: number;
  
  // Time Info
  avgDurationMins: number;
  openingHours?: OpeningHours;
  
  // Flags
  isAnvaVerified: boolean;
  isHiddenGem: boolean;
  isPopular: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export type LocationCategory = 
  | 'attraction'
  | 'restaurant'
  | 'cafe'
  | 'beach'
  | 'temple'
  | 'market'
  | 'nightlife'
  | 'nature'
  | 'museum'
  | 'hotel'
  | 'activity';

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;  // "09:00"
  close: string; // "17:00"
  isClosed?: boolean;
}

export interface LocationSearchParams {
  query?: string;
  city?: string;
  category?: LocationCategory;
  tags?: string[];
  priceLevel?: number[];
  minRating?: number;
  isAnvaVerified?: boolean;
  isHiddenGem?: boolean;
  nearLat?: number;
  nearLng?: number;
  radiusKm?: number;
  limit?: number;
  offset?: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

