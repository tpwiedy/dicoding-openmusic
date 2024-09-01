const InvariantError = require('../../exceptions/InvariantError');
const {
  LoginPayloadSchema,
  RefreshTokenPayloadSchema,
  DeleteTokenPayloadSchema,
} = require('./schema');

const AuthenticationsValidator = {
  validateLoginPayload: (payload) => {
    const validationResult = LoginPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateRefreshTokenPayload: (payload) => {
    const validationResult = RefreshTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteTokenPayload: (payload) => {
    const validationResult = DeleteTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = AuthenticationsValidator;
