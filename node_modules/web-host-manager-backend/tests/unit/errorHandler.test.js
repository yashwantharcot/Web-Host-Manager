const { AppError, errorHandler } = require('../../middleware/errorHandler');

describe('Error Handler', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      path: '/test',
      method: 'GET',
      body: {},
      query: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should handle operational errors correctly', () => {
    const error = new AppError(400, 'Test error');
    
    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Test error'
    });
  });

  it('should handle Sequelize validation errors', () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [
        {
          path: 'email',
          message: 'Email is invalid'
        }
      ]
    };

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Validation error',
      errors: [
        {
          field: 'email',
          message: 'Email is invalid'
        }
      ]
    });
  });

  it('should handle JWT errors', () => {
    const error = {
      name: 'JsonWebTokenError'
    };

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  });

  it('should handle unknown errors in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Something broke!');
    
    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong!'
    });

    process.env.NODE_ENV = originalEnv;
  });

  describe('AppError', () => {
    it('should create operational error with correct properties', () => {
      const error = new AppError(404, 'Not found');

      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(404);
      expect(error.status).toBe('fail');
      expect(error.message).toBe('Not found');
      expect(error.isOperational).toBe(true);
    });

    it('should set status to error for 500-level status codes', () => {
      const error = new AppError(500, 'Server error');

      expect(error.status).toBe('error');
    });
  });
});
