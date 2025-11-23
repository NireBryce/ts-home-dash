import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import os from 'os';
import type { SystemInfo, WeatherInfo, ApiResponse } from './types/dashboard.js';
import { systemInfoSchema, weatherInfoSchema, apiResponseSchema } from './schemas/validation.js';
import { handleApiError, ApiErrorClass } from './utils/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = Fastify({
  logger: true
});

// Serve the HTML page directly
server.get('/', async (request, reply) => {
  try {
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    const html = await fs.readFile(htmlPath, 'utf-8');
    reply.type('text/html').send(html);
  } catch (error) {
    reply.status(500).send('Error loading dashboard');
  }
});

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// System info endpoint with schema validation
server.get('/api/system', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: systemInfoSchema,
          timestamp: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  try {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // Calculate CPU usage with error handling
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      // Guard against division by zero
      return acc + (total > 0 ? ((total - idle) / total) * 100 : 0);
    }, 0) / cpus.length;
    
    const systemInfo: SystemInfo = {
      cpu: {
        usage: Math.round(cpuUsage * 10) / 10, // Round to 1 decimal
        cores: cpus.length
      },
      memory: {
        total: totalMem,
        used: usedMem,
        percentage: Math.round((usedMem / totalMem) * 1000) / 10
      },
      disk: {
        total: 500_000_000_000,
        used: 250_000_000_000,
        percentage: 50
      },
      uptime: os.uptime()
    };
    
    const response: ApiResponse<SystemInfo> = {
      success: true,
      data: systemInfo,
      timestamp: new Date().toISOString()
    };
    
    return response;
    
  } catch (error) {
    // Use our error handler
    handleApiError(reply, error);
  }
});

// Weather endpoint with validation and error handling
server.get('/api/weather', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            oneOf: [
              weatherInfoSchema,
              { type: 'null' }
            ]
          },
          timestamp: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  try {
    // Simulate fetching weather data
    // This could fail, so we wrap it in try-catch
    const weatherData = await fetchWeatherData();
    
    const response: ApiResponse<WeatherInfo | null> = {
      success: true,
      data: weatherData,
      timestamp: new Date().toISOString()
    };
    
    return response;
    
  } catch (error) {
    handleApiError(reply, error);
  }
});

// Helper function that simulates fetching weather
// In a real app, this would call an external API
async function fetchWeatherData(): Promise<WeatherInfo | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulate possible failure (10% chance)
  if (Math.random() < 0.1) {
    throw new ApiErrorClass(
      'Weather service temporarily unavailable',
      'WEATHER_SERVICE_ERROR',
      503
    );
  }
  
  // Return mock data
  const conditions: Array<WeatherInfo['weatherType']> = 
    ['sunny', 'cloudy', 'rainy', 'snowy'];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  if (!randomCondition) {
    // This demonstrates handling array access with noUncheckedIndexedAccess
    throw new ApiErrorClass(
      'Failed to determine weather condition',
      'WEATHER_DATA_ERROR'
    );
  }
  
  return {
    temperature: Math.floor(Math.random() * 30) + 60, // 60-90°F
    condition: randomCondition.charAt(0).toUpperCase() + randomCondition.slice(1),
    weatherType: randomCondition,
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    lastUpdated: new Date().toISOString()
  };
}

// Error handler for routes that don't exist
server.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND'
    },
    timestamp: new Date().toISOString()
  });
});

// Global error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  handleApiError(reply, error);
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server running at http://localhost:3000');
    console.log('📊 System API: http://localhost:3000/api/system');
    console.log('🌤️  Weather API: http://localhost:3000/api/weather');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
