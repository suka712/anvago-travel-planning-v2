// Onboarding Types

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  answers: OnboardingAnswers;
  isComplete: boolean;
}

export interface OnboardingAnswers {
  // Essential
  destination?: string;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  
  // Gamified
  personas?: string[];
  vibesLiked?: string[];
  vibesDisliked?: string[];
  interests?: string[];
  activityLevel?: 'chill' | 'balanced' | 'packed';
  budgetLevel?: 'budget' | 'moderate' | 'luxury';
}

// Question Types

export interface OnboardingQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  subtext?: string;
  skippable: boolean;
  section: 'essential' | 'gamified';
}

export type QuestionType = 
  | 'destination'
  | 'duration'
  | 'dates'
  | 'personas'
  | 'vibe_swiper'
  | 'interests'
  | 'activity_level'
  | 'budget';

// Destination Question

export interface DestinationQuestion extends OnboardingQuestion {
  type: 'destination';
  options: DestinationOption[];
  defaultSelection?: string;
}

export interface DestinationOption {
  id: string;
  name: string;
  country: string;
  available: boolean;
  comingSoon?: boolean;
  image: string;
}

// Duration Question

export interface DurationQuestion extends OnboardingQuestion {
  type: 'duration';
  options: DurationOption[];
  allowCustom: boolean;
  defaultValue?: number;
}

export interface DurationOption {
  value: number;
  label: string;
  icon: string;
  recommended?: boolean;
}

// Persona Question

export interface PersonaQuestion extends OnboardingQuestion {
  type: 'personas';
  maxSelections: number;
  personas: PersonaOption[];
}

export interface PersonaOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

// Vibe Swiper Question

export interface VibeSwiperQuestion extends OnboardingQuestion {
  type: 'vibe_swiper';
  cards: VibeCard[];
  minSwipes: number;
}

export interface VibeCard {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tags: string[];
}

// Interest Question

export interface InterestQuestion extends OnboardingQuestion {
  type: 'interests';
  categories: InterestCategory[];
}

export interface InterestCategory {
  name: string;
  items: InterestItem[];
}

export interface InterestItem {
  id: string;
  icon: string;
  label: string;
}

// Activity Level Question

export interface ActivityLevelQuestion extends OnboardingQuestion {
  type: 'activity_level';
  options: ActivityLevelOption[];
  defaultValue?: string;
}

export interface ActivityLevelOption {
  id: 'chill' | 'balanced' | 'packed';
  title: string;
  emoji: string;
  description: string;
  avgLocationsPerDay: number;
  recommended?: boolean;
}

// Budget Question

export interface BudgetQuestion extends OnboardingQuestion {
  type: 'budget';
  options: BudgetOption[];
  defaultValue?: string;
}

export interface BudgetOption {
  id: 'budget' | 'moderate' | 'luxury';
  title: string;
  emoji: string;
  description: string;
  dailyRange: string;
  recommended?: boolean;
}

// Context Data

export interface OnboardingContext {
  weather: WeatherData;
  traffic: TrafficData;
  events: LocalEvent[];
}

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    uvIndex: number;
  };
  forecast: WeatherForecast[];
  recommendation: string;
}

export interface WeatherForecast {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  rainChance: number;
}

export interface TrafficData {
  status: 'low' | 'moderate' | 'heavy';
  peakHours: string[];
  recommendation: string;
}

export interface LocalEvent {
  name: string;
  date: string;
  relevance: string;
}

