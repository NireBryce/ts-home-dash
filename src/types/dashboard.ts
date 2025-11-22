// System information types
export interface SystemInfo {
  cpu: {
      usage:      number;     // percentage
      cores:      number;
  };
  memory: {
      total:      number;     // in bytes
      used:       number;     // in bytes
      percentage: number;
  };
  disk: {
      total:      number;     // in bytes
      used:       number;     // in bytes
      percentage: number;
  };
  uptime:         number;     // in seconds
}

// Weather information
// Using literal types for weatherType - only these strings are allowed
export interface WeatherInfo {
  temperature:   number;     // in Celsius}
  condition: string;
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'unknown';
  humidity: number;
  lastUpdated: string; // ISO timestamp
}

// Quick link definition
export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon?: string; // Optional property - might not be present
}

// Note definition
export interface Note {
  id: string;
  content: string;
  createdAt: string;  // ISO timestamp
  updatedAt: string;  // ISO timestamp
}

// Dashboard data that combines everything
export interface DashboardData {
  system: SystemInfo;
  weather: WeatherInfo | null; // null if weather fetch fails
  time: {
    current: string;
    timezone: string;
  };
  quickLinks: QuickLink[];
  recentNotes: Note[];
}

// API Response wrapper
// This is a GENERIC type - the T is a placeholder
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// Error response
export interface ApiError {
  success: false; // Literal boolean type!
  error: {
    message: string;
    code?: string;
  };
  timestamp: string;
}

