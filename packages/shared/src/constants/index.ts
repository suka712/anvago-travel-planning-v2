// Anvago Constants

export const APP_NAME = 'Anvago';
export const APP_TAGLINE = 'Travel the world your way';

// Supported Cities
export const SUPPORTED_CITIES = [
  { id: 'danang', name: 'Danang', country: 'Vietnam', available: true },
  { id: 'hoian', name: 'Hoi An', country: 'Vietnam', available: false },
  { id: 'hue', name: 'Huế', country: 'Vietnam', available: false },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', available: false },
  { id: 'hcmc', name: 'Ho Chi Minh City', country: 'Vietnam', available: false },
] as const;

export const DEFAULT_CITY = 'Danang';

// Location Categories
export const LOCATION_CATEGORIES = [
  { id: 'attraction', name: 'Attractions', icon: '🏛️' },
  { id: 'restaurant', name: 'Restaurants', icon: '🍜' },
  { id: 'cafe', name: 'Cafes', icon: '☕' },
  { id: 'beach', name: 'Beaches', icon: '🏖️' },
  { id: 'temple', name: 'Temples & Pagodas', icon: '🛕' },
  { id: 'market', name: 'Markets', icon: '🛒' },
  { id: 'nightlife', name: 'Nightlife', icon: '🌙' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
  { id: 'museum', name: 'Museums', icon: '🖼️' },
  { id: 'activity', name: 'Activities', icon: '🎯' },
] as const;

// Traveler Personas
export const TRAVELER_PERSONAS = [
  {
    id: 'adventurer',
    name: 'The Adventurer',
    emoji: '🏔️',
    description: 'Thrill-seeker, off-beaten-path explorer',
    color: '#FF6B6B',
  },
  {
    id: 'foodie',
    name: 'The Foodie',
    emoji: '🍜',
    description: 'Street food enthusiast, culinary explorer',
    color: '#FFB347',
  },
  {
    id: 'culture_seeker',
    name: 'The Culture Seeker',
    emoji: '🏛️',
    description: 'History buff, temple wanderer',
    color: '#9B59B6',
  },
  {
    id: 'relaxer',
    name: 'The Relaxer',
    emoji: '🏖️',
    description: 'Beach lover, spa enthusiast',
    color: '#3498DB',
  },
  {
    id: 'photographer',
    name: 'The Photographer',
    emoji: '📸',
    description: 'Golden hour chaser, view hunter',
    color: '#E91E63',
  },
  {
    id: 'nightowl',
    name: 'The Night Owl',
    emoji: '🌙',
    description: 'Bar hopper, nightlife explorer',
    color: '#2C3E50',
  },
  {
    id: 'wellness',
    name: 'The Wellness Seeker',
    emoji: '🧘',
    description: 'Yoga retreats, healthy living',
    color: '#27AE60',
  },
  {
    id: 'social_butterfly',
    name: 'The Social Butterfly',
    emoji: '🦋',
    description: 'Hostel vibes, group tours',
    color: '#F39C12',
  },
] as const;

// Duration Options
export const DURATION_OPTIONS = [
  { value: 1, label: 'Day trip', icon: '☀️' },
  { value: 2, label: 'Weekend escape', icon: '🌴' },
  { value: 3, label: '3 days', icon: '🎒', recommended: true },
  { value: 5, label: '5 days', icon: '🧳' },
  { value: 7, label: 'Week+', icon: '🌏' },
] as const;

// Activity Levels
export const ACTIVITY_LEVELS = [
  {
    id: 'chill',
    title: 'Easy Going',
    emoji: '🐢',
    description: '2-3 activities per day, plenty of downtime',
    avgLocationsPerDay: 3,
  },
  {
    id: 'balanced',
    title: 'Balanced',
    emoji: '⚖️',
    description: '4-5 activities, mix of adventure and rest',
    avgLocationsPerDay: 5,
    recommended: true,
  },
  {
    id: 'packed',
    title: 'Adventure Packed',
    emoji: '⚡',
    description: '6+ activities, maximize every moment',
    avgLocationsPerDay: 7,
  },
] as const;

// Budget Levels
export const BUDGET_LEVELS = [
  {
    id: 'budget',
    title: 'Budget Savvy',
    emoji: '💰',
    description: 'Street food, hostels, free attractions',
    dailyRange: 'Under 500,000 VND (~$20)',
    avgDailyVND: 400000,
  },
  {
    id: 'moderate',
    title: 'Comfortable',
    emoji: '💳',
    description: 'Mix of experiences, mid-range dining',
    dailyRange: '500K - 1.5M VND (~$20-60)',
    avgDailyVND: 1000000,
    recommended: true,
  },
  {
    id: 'luxury',
    title: 'Treat Yourself',
    emoji: '✨',
    description: 'Fine dining, premium experiences',
    dailyRange: '1.5M+ VND (~$60+)',
    avgDailyVND: 2500000,
  },
] as const;

// Interest Categories
export const INTEREST_CATEGORIES = [
  {
    name: 'Experiences',
    items: [
      { id: 'sunrise', icon: '🌅', label: 'Catch a sunrise' },
      { id: 'cooking_class', icon: '👨‍🍳', label: 'Cooking class' },
      { id: 'spa', icon: '💆', label: 'Spa day' },
      { id: 'scuba', icon: '🤿', label: 'Diving/Snorkeling' },
      { id: 'hiking', icon: '🥾', label: 'Hiking' },
      { id: 'cycling', icon: '🚴', label: 'Cycling tour' },
    ],
  },
  {
    name: 'Food & Drink',
    items: [
      { id: 'street_food', icon: '🍢', label: 'Street food tour' },
      { id: 'seafood', icon: '🦞', label: 'Fresh seafood' },
      { id: 'coffee', icon: '☕', label: 'Vietnamese coffee' },
      { id: 'craft_beer', icon: '🍺', label: 'Craft beer scene' },
      { id: 'fine_dining', icon: '🍽️', label: 'Fine dining' },
      { id: 'rooftop', icon: '🌃', label: 'Rooftop bars' },
    ],
  },
  {
    name: 'Culture & History',
    items: [
      { id: 'temples', icon: '🛕', label: 'Temples & pagodas' },
      { id: 'museums', icon: '🏛️', label: 'Museums' },
      { id: 'art', icon: '🎨', label: 'Art galleries' },
      { id: 'local_life', icon: '🏘️', label: 'Local neighborhoods' },
      { id: 'markets', icon: '🛒', label: 'Local markets' },
      { id: 'festivals', icon: '🎊', label: 'Local festivals' },
    ],
  },
] as const;

// Transport Modes
export const TRANSPORT_MODES = [
  { id: 'grab_bike', name: 'Grab Bike', icon: '🛵', avgCostPerKm: 5000 },
  { id: 'grab_car', name: 'Grab Car', icon: '🚗', avgCostPerKm: 12000 },
  { id: 'walk', name: 'Walk', icon: '🚶', avgCostPerKm: 0 },
  { id: 'cyclo', name: 'Cyclo (Rickshaw)', icon: '🛺', avgCostPerKm: 15000 },
  { id: 'taxi', name: 'Taxi', icon: '🚕', avgCostPerKm: 15000 },
  { id: 'bicycle', name: 'Bicycle', icon: '🚲', avgCostPerKm: 0 },
] as const;

// Currency
export const CURRENCY = {
  code: 'VND',
  symbol: '₫',
  name: 'Vietnamese Dong',
  exchangeRateUSD: 24500, // Approximate
} as const;

// Danang Coordinates
export const DANANG_CENTER = {
  latitude: 16.0544,
  longitude: 108.2022,
} as const;

// API Endpoints
export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

// Pagination Defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Premium Features
export const PREMIUM_FEATURES = [
  'smart_search',
  'ai_optimization',
  'localize_anva',
  'priority_support',
  'offline_access',
  'advanced_booking',
] as const;

// Weather Conditions
export const WEATHER_CONDITIONS = {
  clear: { icon: '☀️', label: 'Clear' },
  partly_cloudy: { icon: '⛅', label: 'Partly Cloudy' },
  cloudy: { icon: '☁️', label: 'Cloudy' },
  rain: { icon: '🌧️', label: 'Rain' },
  heavy_rain: { icon: '⛈️', label: 'Heavy Rain' },
  thunderstorm: { icon: '🌩️', label: 'Thunderstorm' },
  fog: { icon: '🌫️', label: 'Fog' },
  hot: { icon: '🥵', label: 'Hot' },
} as const;

// Trip Statuses
export const TRIP_STATUSES = {
  scheduled: { label: 'Scheduled', color: '#4FC3F7' },
  active: { label: 'In Progress', color: '#4CAF50' },
  paused: { label: 'Paused', color: '#FFC107' },
  completed: { label: 'Completed', color: '#9E9E9E' },
  cancelled: { label: 'Cancelled', color: '#F44336' },
} as const;

