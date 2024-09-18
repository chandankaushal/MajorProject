const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      // Use Joi.object() here
      filename: Joi.string().default("noName"), // Default value for filename
      url: Joi.string().uri(),
    }),
    price: Joi.number().positive().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(), // Ensure listing is a required object
});

module.exports = listingSchema;
