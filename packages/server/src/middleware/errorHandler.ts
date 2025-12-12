import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse, ApiError, ErrorCode } from '@anvago/shared';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = 'INTERNAL_ERROR',
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: Record<string, unknown>) {
    return new AppError(message, 'VALIDATION_ERROR', 400, details);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(message, 'AUTHENTICATION_ERROR', 401);
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError(message, 'AUTHORIZATION_ERROR', 403);
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError(message, 'NOT_FOUND', 404);
  }

  static conflict(message: string, details?: Record<string, unknown>) {
    return new AppError(message, 'CONFLICT', 409, details);
  }

  static rateLimited(message: string = 'Too many requests') {
    return new AppError(message, 'RATE_LIMITED', 429);
  }

  static internal(message: string = 'Internal server error') {
    return new AppError(message, 'INTERNAL_ERROR', 500);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle AppError
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    };
    return res.status(err.statusCode).json(response);
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        ...(process.env.NODE_ENV === 'development' && { 
          details: { originalError: err.message },
          stack: err.stack 
        }),
      },
    };
    return res.status(500).json(response);
  }

  // Handle validation errors (Zod)
  if (err.name === 'ZodError') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { errors: (err as any).errors },
      },
    };
    return res.status(400).json(response);
  }

  // Generic error
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };
  
  return res.status(500).json(response);
}

