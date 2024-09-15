const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeadersSchema } = require('./schema');

const UploadsValidator = {
  validateImagesHeaders: (headers) => {
    const validationResults = ImageHeadersSchema.validate(headers);

    if (validationResults.error) {
      throw new InvariantError(validationResults.error.message);
    }
  },
};

module.exports = UploadsValidator;
