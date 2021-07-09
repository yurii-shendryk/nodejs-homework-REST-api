const { Types } = require('mongoose');
const Joi = require('joi');
const { statusCode, subscription } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
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

const schemaQueryContact = Joi.object({
  sortBy: Joi.string().valid('name', 'email', 'phone', 'id').optional(),
  sortByDesc: Joi.string().valid('name', 'email', 'phone', 'id').optional(),
  filter: Joi.string().valid('name', 'email', 'phone').optional(),
  limit: Joi.number().integer().min(1).max(20).optional(),
  page: Joi.number().integer().optional(),
  favorite: Joi.boolean().optional(),
}).without('sortBy', 'sortByDesc');

const schemaCreateUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
});

const schemaResendVerificationEmail = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .required(),
});

const schemaUpdateUserSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...Object.values(subscription))
    .required(),
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

const validateQueryContact = (req, res, next) => {
  return validate(schemaQueryContact, req.query, next);
};

const validateObjectId = (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.contactId)) {
    return next(new CustomError(statusCode.BAD_REQUEST, 'Invalid id'));
  }
  next();
};

const validateCreateUser = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new CustomError(statusCode.BAD_REQUEST, ' missing fields'));
  }
  return validate(schemaCreateUser, req.body, next);
};

const validateResendVerificationEmail = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(
      new CustomError(statusCode.BAD_REQUEST, 'missing required field email')
    );
  }
  return validate(schemaResendVerificationEmail, req.body, next);
};

const validateUpdateUserSubscription = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(
      new CustomError(statusCode.BAD_REQUEST, 'missing field subscription')
    );
  }
  return validate(schemaUpdateUserSubscription, req.body, next);
};

module.exports = {
  validateCreateContact,
  validateUpdateStatusContact,
  validateQueryContact,
  validateObjectId,
  validateCreateUser,
  validateUpdateUserSubscription,
  validateResendVerificationEmail,
};
