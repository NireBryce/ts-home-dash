
import type { SystemInfo, WeatherInfo } from '../types/dashboard.js';

// Type guard for SystemInfo
// The return type 'value is SystemInfo' is the magic part!
export function isSystemInfo(value: unknown): value is SystemInfo {
  // First check: is it an object?
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  
  // TypeScript now knows value is an object, but not which properties it has
  // We need to check if it has the right shape
  const obj = value as Record<string, unknown>;
  
  // Check for required top-level properties
  if (!obj.cpu || !obj.memory || !obj.disk || typeof obj.uptime !== 'number') {
    return false;
  }
  
  // Check CPU structure
  const cpu = obj.cpu as Record<string, unknown>;
  if (typeof cpu.usage !== 'number' || typeof cpu.cores !== 'number') {
    return false;
  }
  
  // If we get here, it matches our type!
  // In a real app, you might use a validation library like Zod
  return true;
}

// Type guard for WeatherInfo
export function isWeatherInfo(value: unknown): value is WeatherInfo {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  
  const obj = value as Record<string, unknown>;
  
  // Check all required properties
  if (
    typeof obj.temperature !== 'number' ||
    typeof obj.condition !== 'string' ||
    typeof obj.weatherType !== 'string' ||
    typeof obj.humidity !== 'number' ||
    typeof obj.lastUpdated !== 'string'
  ) {
    return false;
  }
  
  // Check weatherType is one of the allowed values
  const validTypes = ['sunny', 'cloudy', 'rainy', 'snowy', 'unknown'];
  if (!validTypes.includes(obj.weatherType)) {
    return false;
  }
  
  return true;
}

// Generic type guard for checking if something is an Error
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Type guard to check if a value is defined (not null or undefined)
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Example of using discriminated unions
// This checks the 'success' property to determine the type
export function isSuccessResponse<T>(
  response: { success: boolean; data?: T; error?: unknown }
): response is { success: true; data: T } {
  return response.success === true && 'data' in response;
}
