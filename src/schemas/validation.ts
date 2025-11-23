// JSON Schema definitions for runtime validation
// These should match our TypeScript interfaces!

export const systemInfoSchema = {
  type: 'object',
  required: ['cpu', 'memory', 'disk', 'uptime'],
  properties: {
    cpu: {
      type: 'object',
      required: ['usage', 'cores'],
      properties: {
        usage: { type: 'number', minimum: 0, maximum: 100 },
        cores: { type: 'integer', minimum: 1 }
      }
    },
    memory: {
      type: 'object',
      required: ['total', 'used', 'percentage'],
      properties: {
        total: { type: 'number', minimum: 0 },
        used: { type: 'number', minimum: 0 },
        percentage: { type: 'number', minimum: 0, maximum: 100 }
      }
    },
    disk: {
      type: 'object',
      required: ['total', 'used', 'percentage'],
      properties: {
        total: { type: 'number', minimum: 0 },
        used: { type: 'number', minimum: 0 },
        percentage: { type: 'number', minimum: 0, maximum: 100 }
      }
    },
    uptime: { type: 'number', minimum: 0 }
  }
} as const; // 'as const' makes this readonly and more type-safe

export const weatherInfoSchema = {
  type: 'object',
  required: ['temperature', 'condition', 'weatherType', 'humidity', 'lastUpdated'],
  properties: {
    temperature: { type: 'number' },
    condition: { type: 'string' },
    weatherType: {
      type: 'string',
      enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'unknown'] // Must match our type!
    },
    humidity: { type: 'number', minimum: 0, maximum: 100 },
    lastUpdated: { type: 'string', format: 'date-time' }
  }
} as const;

// Generic API response schema
// We'll use this as a template
export const apiResponseSchema = {
  type: 'object',
  required: ['success', 'data', 'timestamp'],
  properties: {
    success: { type: 'boolean' },
    data: {}, // Will be replaced with specific schema
    timestamp: { type: 'string', format: 'date-time' }
  }
} as const;

// Error response schema
export const apiErrorSchema = {
  type: 'object',
  required: ['success', 'error', 'timestamp'],
  properties: {
    success: { type: 'boolean', const: false }, // Must be false
    error: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
        code: { type: 'string' }
      }
    },
    timestamp: { type: 'string', format: 'date-time' }
  }
} as const;
