const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const authGuard = (req, res, next) => {
  const [, token] = req.headers.authorization.split(' ');

  if (!token) {
    next(new CustomError(statusCode.UNAUTHORIZED, 'Not authorized'));
  }
  try {
    const user = jwt.decode(token, SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    next(new CustomError(statusCode.UNAUTHORIZED, 'Not authorized'));
  }
};

module.exports = { authGuard };
