const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');
const { getUserById } = require('../model/users');

const authGuard = async (req, res, next) => {
  const token = req.get('Authorization')?.split(' ')[1];
  if (!token) {
    next(new CustomError(statusCode.UNAUTHORIZED, 'Not authorized'));
  }
  try {
    const user = jwt.decode(token, SECRET_KEY);
    const userInDb = await getUserById(user.id);
    if (!userInDb || userInDb.token !== token) {
      next(new CustomError(statusCode.UNAUTHORIZED, 'Not authorized'));
    }
    req.user = userInDb;
    next();
  } catch (error) {
    next(new CustomError(statusCode.UNAUTHORIZED, 'Not authorized'));
  }
};

module.exports = { authGuard };
