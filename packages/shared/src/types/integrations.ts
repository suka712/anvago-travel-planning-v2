// Integration Types (Mock Services)

// Grab Integration

export interface GrabFareEstimate {
  vehicleType: GrabVehicleType;
  estimatedFare: number;
  currency: 'VND';
  estimatedDuration: number; // minutes
  distance: number; // km
  surgeMultiplier?: number;
  fareBreakdown: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    surgeAmount?: number;
  };
}

export type GrabVehicleType = 'bike' | 'car' | 'car_plus';

export interface GrabBookingRequest {
  vehicleType: GrabVehicleType;
  pickup: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoff: {
    latitude: number;
    longitude: number;
    address: string;
  };
  scheduledTime?: Date;
}

export interface GrabBooking {
  bookingId: string;
  status: GrabBookingStatus;
  vehicleType: GrabVehicleType;
  fare: number;
  currency: 'VND';
  driver?: GrabDriver;
  eta?: number; // minutes
  pickup: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoff: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: Date;
}

export type GrabBookingStatus = 
  | 'searching'
  | 'driver_found'
  | 'driver_arriving'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface GrabDriver {
  id: string;
  name: string;
  rating: number;
  totalTrips: number;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleColor: string;
  photoUrl: string;
  phoneNumber: string;
}

// Booking.com Integration

export interface AccommodationSearchParams {
  city: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms?: number;
  priceMin?: number;
  priceMax?: number;
  propertyType?: AccommodationType[];
  amenities?: string[];
  rating?: number;
}

export type AccommodationType = 
  | 'hotel'
  | 'hostel'
  | 'resort'
  | 'apartment'
  | 'villa'
  | 'guesthouse';

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  rating: number;
  reviewScore: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  currency: 'VND';
  image: string;
  images: string[];
  amenities: string[];
  address: string;
  latitude: number;
  longitude: number;
  distanceToCenter: number;
  highlights: string[];
  provider: 'booking_com';
}

export interface AccommodationBooking {
  confirmationNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  propertyId: string;
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
  totalPrice: number;
  currency: 'VND';
}

// Klook Integration

export interface ActivitySearchParams {
  city: string;
  category?: string;
  date?: Date;
  priceMin?: number;
  priceMax?: number;
  duration?: string;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  currency: 'VND';
  rating: number;
  reviewCount: number;
  duration: string;
  image: string;
  images: string[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  meetingPoint?: string;
  cancellationPolicy: string;
  provider: 'klook';
}

export interface ActivityBooking {
  confirmationNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  activityId: string;
  activityName: string;
  date: Date;
  time?: string;
  participants: number;
  totalPrice: number;
  currency: 'VND';
}

// Weather Integration

export interface WeatherResponse {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    visibility: number;
    condition: WeatherCondition;
    icon: string;
  };
  forecast: DailyForecast[];
  alerts?: WeatherAlert[];
}

export interface DailyForecast {
  date: string;
  sunrise: string;
  sunset: string;
  temp: {
    min: number;
    max: number;
  };
  humidity: number;
  rainChance: number;
  condition: WeatherCondition;
  icon: string;
}

export type WeatherCondition = 
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'fog'
  | 'hot';

export interface WeatherAlert {
  type: 'rain' | 'storm' | 'heat' | 'flood';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  startTime: Date;
  endTime?: Date;
}

// Traffic Integration (Mock)

export interface TrafficResponse {
  city: string;
  timestamp: Date;
  overallStatus: TrafficStatus;
  hotspots: TrafficHotspot[];
  recommendation: string;
}

export type TrafficStatus = 'low' | 'moderate' | 'heavy';

export interface TrafficHotspot {
  area: string;
  status: TrafficStatus;
  reason?: string;
  expectedDuration?: number; // minutes
  alternativeRoute?: string;
}

