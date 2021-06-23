const { Types } = require('mongoose');
const Joi = require('joi');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

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
  favorite: Joi.boolean().optional(),
});

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = (shema, body, next) => {
  const { error } = shema.validate(body);
  if (error) {
    const [
      {
        message,
        type,
        context: { key },
      },
    ] = error.details;
    const errorMessage =
      type === 'any.required'
        ? `missing required ${key} field`
        : `${message.replace(/"/g, '')}`;
    return next(new CustomError(statusCode.BAD_REQUEST, `${errorMessage}`));
  }
  next();
};

const validateCreateContact = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new CustomError(statusCode.BAD_REQUEST, ' missing fields'));
  }
  return validate(schemaCreateContact, req.body, next);
};

const validateUpdateStatusContact = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(
      new CustomError(statusCode.BAD_REQUEST, 'missing field favorite')
    );
  }
  return validate(schemaUpdateStatusContact, req.body, next);
};

const validateObjectId = (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.contactId)) {
    return next(new CustomError(statusCode.BAD_REQUEST, 'Invalid id'));
  }
  next();
};

module.exports = {
  validateCreateContact,
  validateUpdateStatusContact,
  validateObjectId,
};
