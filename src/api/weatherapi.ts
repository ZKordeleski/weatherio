import type { WeatherData } from "../types/weather";

const API_KEY = import.meta.env.VITE_VISUALCROSSING_API_KEY || '';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

/**
 * Fetches weather forecast for a specific location and date range
 * @param location Location name, zip code, or coordinates
 * @param startDate Optional start date (format: YYYY-MM-DD)
 * @param endDate Optional end date (format: YYYY-MM-DD)
 * @param options Additional API options
 */

export async function getWeatherForecast(
  location: string,
  startDate?: string,
  endDate?: string,
  options: Record<string, string> = {}
): Promise<WeatherData> {
  let url = `${BASE_URL}/${encodeURIComponent(location)}`;
  
  // Add date range if provided
  if (startDate && endDate) {
    url += `/${startDate}/${endDate}`;
  } else if (startDate) {
    url += `/${startDate}`;
  }
  
  // Add query parameters
  const params = new URLSearchParams({
    unitGroup: 'us', // (°F)
    include: 'days,hours,current',
    contentType: 'json',
    key: API_KEY,
    ...options
  });
  
  url += `?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}