export interface Coordinates {
  x: number;
  y: number;
}

export interface MapMarker {
  id: string;
  label: string;
  x: number; // Percentage 0-100 relative to image width
  y: number; // Percentage 0-100 relative to image height
  regionContext: string; // Context for AI
}

export interface Story {
  title: string;
  content: string;
  region: string;
}

export interface FolkloreResponse {
  title: string;
  story: string;
}

export enum AppState {
  EXPLORE = 'EXPLORE',
  READING = 'READING'
}