import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import type { SystemInfo, WeatherInfo, ApiResponse } from './types/dashboard.js';

// ES modules don't have __dirname, so we create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//create a fastify instance
const server = Fastify({
    logger: true,

});

// Register static file serving for our HTML
// This teaches us about Fastify plugins
await server.register(import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/' // Serve files at root path
});

// Health check endpoint
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// System info endpoint - properly typed!
server.get('/api/system', async (request, reply) => {
  // Notice how we're typing our response with our custom types
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  // Let's calculate CPU usage
  // This is simplified - averages current CPU tick usage
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const idle = cpu.times.idle;
    return acc + ((total - idle) / total) * 100;
  }, 0) / cpus.length;
  
  // Build our SystemInfo object
  // TypeScript checks that this matches our interface!
  const systemInfo: SystemInfo = {
    cpu: {
      usage: cpuUsage,
      cores: cpus.length
    },
    memory: {
      total: totalMem,
      used: usedMem,
      percentage: (usedMem / totalMem) * 100
    },
    disk: {
      // For now, we'll use placeholder values
      // We'll improve this later with a proper disk usage library
      total: 500_000_000_000, // 500GB
      used: 250_000_000_000,  // 250GB
      percentage: 50
    },
    uptime: os.uptime()
  };
  
  // Wrap in our ApiResponse generic type
  // TypeScript infers: ApiResponse<SystemInfo>
  const response: ApiResponse<SystemInfo> = {
    success: true,
    data: systemInfo,
    timestamp: new Date().toISOString()
  };
  
  return response;
});

// Weather endpoint - with mock data for now
server.get('/api/weather', async (request, reply) => {
  // For learning purposes, we'll return mock data
  
  // Simulate that weather might not be available
  // This demonstrates the WeatherInfo | null type
  const weatherAvailable = true; // Change to false to test null case
  
  const weatherData: WeatherInfo | null = weatherAvailable ? {
    temperature: 72,
    condition: 'Partly Cloudy',
    weatherType: 'cloudy', // TypeScript ensures this is one of our allowed values!
    humidity: 65,
    lastUpdated: new Date().toISOString()
  } : null;
  
  const response: ApiResponse<WeatherInfo | null> = {
    success: true,
    data: weatherData,
    timestamp: new Date().toISOString()
  };
  
  return response;
});

// Start the server
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
