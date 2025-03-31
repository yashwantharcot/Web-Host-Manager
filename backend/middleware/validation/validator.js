const { AppError } = require('../errorHandler');

const createValidator = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body against schema
      const validated = await schema.validateAsync(req.body, {
        abortEarly: false, // Return all errors, not just the first one
        stripUnknown: true // Remove any fields that aren't in the schema
      });

      // Replace request body with validated data
      req.body = validated;
      next();
    } catch (error) {
      if (error.isJoi) {
        // Format validation errors
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        // Pass formatted errors to error handler
        return next(new AppError(400, 'Validation failed', errors));
      }

      // Pass other errors to error handler
      next(error);
    }
  };
};

module.exports = createValidator;
