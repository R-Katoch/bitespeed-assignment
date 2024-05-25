const { check, validationResult } = require('express-validator');

const validateIdentifyRequest = [
  // Validate the email field (optional, must be a valid email if provided)
  check('email')
    .optional({ nullable: true, checkFalsy: true }) // Allows optional, null, or empty strings
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(), // Sanitization: normalize email

  // Validate the phoneNumber field (optional, must be a valid numeric string if provided)
  check('phoneNumber')
    .optional({ nullable: true, checkFalsy: true }) // Allows optional, null, or empty strings
    .isNumeric().withMessage('Phone number must contain only numeric characters')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 digits')
    .trim(), // Sanitization: trim whitespace

  // Custom validation to ensure at least one of the fields is provided
  (req, res, next) => {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
      return res.status(422).json({
        errors: [{ msg: 'Either email or phoneNumber must be provided', param: 'email or phoneNumber' }],
      });
    }
    next(); // Proceed to the next middleware/function if validation passes
  },

  // Middleware to handle the result of the validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a 422 status with errors if validation fails
      return res.status(422).json({
        errors: errors.array({ onlyFirstError: true }),
      });
    }
    next(); // Proceed to the next middleware/function if validation passes
  },
];

module.exports = {
  validateIdentifyRequest,
};
