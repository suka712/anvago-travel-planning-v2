// User Types

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isPremium: boolean;
  premiumUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  
  // Travel Style
  personas: TravelerPersona[];
  vibePreferences: string[];
  interests: string[];
  
  // Practical
  budgetLevel: BudgetLevel;
  mobilityLevel: MobilityLevel;
  groupSize: number;
  
  // Special Needs
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
}

export type TravelerPersona = 
  | 'adventurer'
  | 'foodie'
  | 'culture_seeker'
  | 'relaxer'
  | 'photographer'
  | 'nightowl'
  | 'wellness'
  | 'social_butterfly';

export type BudgetLevel = 'budget' | 'moderate' | 'luxury';
export type MobilityLevel = 'low' | 'moderate' | 'high';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface OAuthData {
  provider: 'google' | 'facebook';
  token: string;
}

