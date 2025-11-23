import type { FastifyReply } from 'fastify';
import type { ApiError } from '../types/dashboard.js';
import { isError } from './typeGuards.js';

// Create a standard error response
export function createErrorResponse(
  message: string,
  code?: string
): ApiError {
  return {
    success: false,
    error: {
      message,
      code
    },
    timestamp: new Date().toISOString()
  };
}

// Handle errors and send appropriate responses
export function handleError(reply: FastifyReply, error: unknown): void {
  // Use our type guard to check if it's an Error object
  if (isError(error)) {
    // Now TypeScript knows error is an Error
    reply.status(500).send(
      createErrorResponse(error.message, 'INTERNAL_ERROR')
    );
    return;
  }
  
  // If it's a string, use it as the message
  if (typeof error === 'string') {
    reply.status(500).send(
      createErrorResponse(error, 'INTERNAL_ERROR')
    );
    return;
  }
  
  // Unknown error type
  reply.status(500).send(
    createErrorResponse('An unexpected error occurred', 'UNKNOWN_ERROR')
  );
}

// Custom error class for API errors
// This demonstrates extending built-in classes with TypeScript
export class ApiErrorClass extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
    
    // This is needed for proper prototype chain in TypeScript
    Object.setPrototypeOf(this, ApiErrorClass.prototype);
  }
}

// Type guard for our custom error
export function isApiError(error: unknown): error is ApiErrorClass {
  return error instanceof ApiErrorClass;
}

// Handle our custom errors
export function handleApiError(reply: FastifyReply, error: unknown): void {
  if (isApiError(error)) {
    // TypeScript knows all the properties of ApiErrorClass here
    reply.status(error.statusCode).send(
      createErrorResponse(error.message, error.code)
    );
    return;
  }
  
  // Fall back to generic error handler
  handleError(reply, error);
}
