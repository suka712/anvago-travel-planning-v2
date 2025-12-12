// Trip Types (Active Journey)

import type { Itinerary } from './itinerary';

export interface Trip {
  id: string;
  userId: string;
  itineraryId: string;
  itinerary?: Itinerary;
  
  // Status
  status: TripStatus;
  
  // Timing
  scheduledStart: Date;
  actualStart?: Date;
  completedAt?: Date;
  
  // Progress
  currentDayNumber: number;
  currentItemIndex: number;
  
  // Live Tracking (mock in demo)
  lastLatitude?: number;
  lastLongitude?: number;
  lastUpdated?: Date;
  
  // Stats
  completedItems: number;
  totalItems: number;
  
  // Relations
  events: TripEvent[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type TripStatus = 
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface TripEvent {
  id: string;
  tripId: string;
  type: TripEventType;
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

export type TripEventType = 
  | 'trip_started'
  | 'trip_paused'
  | 'trip_resumed'
  | 'trip_completed'
  | 'trip_cancelled'
  | 'location_arrived'
  | 'location_departed'
  | 'location_skipped'
  | 'transport_booked'
  | 'transport_completed'
  | 'schedule_adjusted'
  | 'weather_alert'
  | 'traffic_alert'
  | 'user_action'
  | 'system_notification';

// Notification Types

export interface TripNotification {
  id: string;
  type: NotificationType;
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  icon: string;
  primaryAction?: NotificationAction;
  secondaryAction?: NotificationAction;
  autoDismiss: boolean;
  duration?: number;
  timestamp: Date;
}

export type NotificationType = 
  | 'transport'
  | 'schedule'
  | 'weather'
  | 'traffic'
  | 'suggestion'
  | 'milestone'
  | 'reminder';

export interface NotificationAction {
  label: string;
  actionType: string;
  payload?: Record<string, unknown>;
}

// Demo Simulation Types

export interface DemoSimulation {
  isActive: boolean;
  speed: 1 | 2 | 5 | 10;
  currentTime: Date;
  tripId?: string;
}

export interface SimulationCommand {
  type: 
    | 'start'
    | 'pause'
    | 'reset'
    | 'set_speed'
    | 'advance_time'
    | 'move_to_location'
    | 'trigger_weather'
    | 'trigger_traffic'
    | 'trigger_arrival'
    | 'complete_trip';
  payload?: Record<string, unknown>;
}

