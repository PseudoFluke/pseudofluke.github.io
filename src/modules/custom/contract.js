const Joi = require("joi");

//=> using Joi to validate body input

exports.customInputContract = Joi.object({
  field: Joi.string(),
});
