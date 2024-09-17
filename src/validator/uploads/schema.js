const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/apng',
      'image/avif',
      'image/webp',
      'image/svg+xml'
    )
    .required(),
}).unknown();

module.exports = { ImageHeadersSchema };
