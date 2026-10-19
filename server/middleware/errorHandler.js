/**
 * Error Handler Middleware
 * Centralized error handling for Express.js application
 */

const { supabase } = require('../config/supabase');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle different types of errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};


// Send error in development
const sendErrorDev = (err, req, res) => {
  // Log error for debugging
  console.error('ERROR 💥', {
    message: err.message || 'Unknown error',
    statusCode: err.statusCode || 500,
    stack: err.stack || 'No stack trace available'
  });

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Send error in production
const sendErrorProd = async (err, req, res) => {
  // Log error to Supabase analytics_events table
  try {
    if (supabase) {
      const errorData = {
        type: 'error',
        event_name: err.message || 'Unknown Error',
        page: req.originalUrl || '',
        category: err.stack || '',
        label: req.method || '',
        value: err.statusCode || 500,
        user_agent: req.headers['user-agent'] || '',
        ip_address: req.ip || '',
        created_at: new Date().toISOString()
      };
      
      const { error: logError } = await supabase.from('analytics_events').insert([errorData]);
      if (logError) console.warn('Failed to save error to Supabase:', logError.message);
    }
  } catch (logError) {
    console.error('Failed to log error to Supabase:', logError);
  }

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', {
      message: err.message || 'Unknown error',
      statusCode: err.statusCode || 500,
      stack: err.stack
    });

    res.status(500).json({
      success: false,
      error: 'Something went wrong on our end. Please try again later.'
    });
  }
};

// Main error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    // Handle Supabase / PostgreSQL / PostgREST errors
    if (error.code) {
      switch (error.code) {
        case '23505':
          error = new AppError('A record with this identifier already exists', 409);
          break;
        case '23503':
          error = new AppError('Referenced record does not exist', 400);
          break;
        case '42P01':
          error = new AppError('Database table configuration error', 500);
          break;
        case 'PGRST116':
          error = new AppError('Requested record not found', 404);
          break;
        case 'PGRST301':
          error = new AppError('Authentication session has expired', 401);
          break;
        case 'PGRST200':
          error = new AppError('Invalid query parameters', 400);
          break;
      }
    }

    sendErrorProd(error, req, res);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// 404 handler for non-existent routes
const notFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

// Async error wrapper to catch errors in async functions
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Rate limit error handler
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: req.rateLimit.resetTime
  });
};

module.exports = {
  errorHandler,
  notFound,
  catchAsync,
  rateLimitHandler,
  AppError
};