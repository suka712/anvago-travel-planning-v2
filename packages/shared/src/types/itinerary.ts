// Itinerary Types

import type { Location } from './location';

export interface Itinerary {
  id: string;
  
  // Basic Info
  title: string;
  description?: string;
  coverImage?: string;
  
  // Configuration
  city: string;
  durationDays: number;
  startDate?: Date;
  
  // User/System
  userId?: string;
  isTemplate: boolean;
  isPublic: boolean;
  
  // AI Metadata
  generatedBy?: 'ai' | 'user' | 'template';
  generationPrompt?: string;
  
  // Stats
  estimatedBudget?: number;
  totalDistance?: number;
  
  // Relations
  items: ItineraryItem[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryItem {
  id: string;
  itineraryId: string;
  locationId: string;
  location?: Location;
  
  // Scheduling
  dayNumber: number;
  orderIndex: number;
  startTime?: string;
  endTime?: string;
  
  // Custom Fields
  notes?: string;
  isOptional: boolean;
  
  // Transportation to next
  transportMode?: TransportMode;
  transportDuration?: number;
  transportCost?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export type TransportMode = 
  | 'grab_bike'
  | 'grab_car'
  | 'walk'
  | 'cyclo'
  | 'taxi'
  | 'bus'
  | 'bicycle';

export interface ItineraryTemplate {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  city: string;
  durationDays: number;
  
  // Matching Criteria
  targetPersonas: string[];
  targetVibes: string[];
  targetBudget: string;
  
  // Content
  highlights: string[];
  itineraryId: string;
  
  displayOrder: number;
  isActive: boolean;
}

// Generation Types

export interface ItineraryGenerationRequest {
  city: string;
  durationDays: number;
  startDate?: Date;
  preferences: {
    personas: string[];
    vibes: string[];
    interests: string[];
    budgetLevel: string;
    activityLevel: string;
  };
  weather?: WeatherContext;
}

export interface WeatherContext {
  current: {
    temp: number;
    condition: string;
    humidity: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    rainChance: number;
  }>;
}

export interface ItineraryResult {
  id: string;
  title: string;
  tagline: string;
  matchScore: number;
  highlights: string[];
  coverImage: string;
  stats: {
    duration: string;
    locations: number;
    walkingDistance: string;
    estimatedBudget: string;
  };
  dayPreviews: Array<{
    day: number;
    title: string;
    locations: number;
  }>;
  badges: string[];
}

// Optimization Types

export type OptimizationCriterion = 
  | 'route'           // Minimize travel time
  | 'weather'         // Adapt to forecast
  | 'budget'          // Reduce costs
  | 'walking'         // Minimize walking
  | 'views'           // Photo-friendly timing
  | 'maximize'        // Pack more in
  | 'local';          // More authentic spots

export interface OptimizationRequest {
  itineraryId: string;
  criterion: OptimizationCriterion;
}

export interface OptimizationResult {
  original: Itinerary;
  optimized: Itinerary;
  changes: Array<{
    type: 'reorder' | 'replace' | 'add' | 'remove' | 'timing';
    description: string;
    itemId?: string;
    newItemId?: string;
  }>;
  improvements: {
    timeSaved?: number;
    moneySaved?: number;
    distanceReduced?: number;
    ratingsImproved?: number;
  };
}

// Localization Types

export interface LocalizationSuggestion {
  originalItem: ItineraryItem;
  suggestedLocation: Location;
  reason: string;
  localInsight: string;
}

