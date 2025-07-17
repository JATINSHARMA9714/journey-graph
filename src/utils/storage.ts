// Simple localStorage functions for saving and loading journeys

import { Journey } from '../types/journey';

const STORAGE_KEY = 'journeys';

// Save all journeys to localStorage
export function saveJourneys(journeys: Journey[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journeys));
  } catch (error) {
    console.error('Failed to save journeys:', error);
    throw new Error('Failed to save data');
  }
}

// Load all journeys from localStorage
export function loadJourneys(): Journey[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load journeys:', error);
    return [];
  }
}

// Save a single journey
export function saveJourney(journey: Journey): void {
  const journeys = loadJourneys();
  const existingIndex = journeys.findIndex(j => j.id === journey.id);
  
  if (existingIndex >= 0) {
    journeys[existingIndex] = journey;
  } else {
    journeys.push(journey);
  }
  
  saveJourneys(journeys);
}

// Delete a journey
export function deleteJourney(journeyId: string): void {
  const journeys = loadJourneys();
  const filteredJourneys = journeys.filter(j => j.id !== journeyId);
  saveJourneys(filteredJourneys);
}

// Get a single journey by ID
export function getJourneyById(journeyId: string): Journey | null {
  const journeys = loadJourneys();
  return journeys.find(j => j.id === journeyId) || null;
}