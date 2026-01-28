export enum ViewState {
  WALK = 'WALK',
  GARDEN = 'GARDEN',
  PLANTING = 'PLANTING',
  LISTENING = 'LISTENING' // Viewing a specific seed
}

export enum MoodType {
  JOY = 'JOY',
  SADNESS = 'SADNESS',
  ANGER = 'ANGER',
  CALM = 'CALM'
}

export type WeatherType = 'SUNNY' | 'RAINY' | 'WINDY' | 'CLOUDY';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Seed {
  id: string;
  authorId: string; // Anonymous ID
  location: Coordinates;
  mood: MoodType;
  text: string;
  hasAudio: boolean;
  timestamp: number;
  resonates: number; // Likes
  isCollected?: boolean; // If user has listened to it
}

export interface UserContext {
  location: Coordinates;
  poeticLocation: string;
}