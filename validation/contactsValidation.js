const Joi = require('joi');
const { statusCode } = require('../helpers/constants');

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string()
    .pattern(/^(\+)?((\d{2,3}) ?\d|\d)(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}\d$/)
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
  phone: Joi.string()
    .pattern(/^(\+)?((\d{2,3}) ?\d|\d)(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}\d$/)
    .optional(),
});

const schemaReplaceContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string()
    .pattern(/^(\+)?((\d{2,3}) ?\d|\d)(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}\d$/)
    .required(),
});

const validate = (shema, body, next) => {
  if (Object.keys(body).length === 0) {
    return next({
      status: statusCode.BAD_REQUEST,
      message: 'missing fields',
    });
  }
  const { error } = shema.validate(body);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: statusCode.BAD_REQUEST,
      message: `${message.replace(/"/g, '')}`,
    });
  }
  next();
};

const validateCreateContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

const validateUpdateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};

const validateReplaceContact = (req, res, next) => {
  return validate(schemaReplaceContact, req.body, next);
};

module.exports = {
  validateCreateContact,
  validateUpdateContact,
  validateReplaceContact,
};
