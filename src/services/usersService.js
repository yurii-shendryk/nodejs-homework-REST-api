/* eslint-disable no-useless-catch */
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { CustomError } = require('../helpers/errors');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { statusCode } = require('../helpers/constants');
const {
  getUserByEmail,
  createUser,
  updateToken,
  updateUserById,
} = require('../model/users');

const signup = async (email, password) => {
  const user = await getUserByEmail(email);
  if (user) {
    throw new CustomError(statusCode.CONFLICT, 'Email in use');
  }
  const newUser = await createUser(email, password);
  return newUser;
};

const login = async (email, password) => {
  const user = await getUserByEmail(email);
  const isValidPassword = await user?.validPassword(password);
  if (!user || !isValidPassword) {
    throw new CustomError(
      statusCode.UNAUTHORIZED,
      'Email or password is wrong'
    );
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
  const result = await updateToken(user._id, token);
  return result;
};

const updateUser = async (userId, body) => await updateUserById(userId, body);

module.exports = {
  signup,
  login,
  updateUser,
};
