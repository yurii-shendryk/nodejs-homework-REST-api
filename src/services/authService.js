/* eslint-disable no-useless-catch */
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { CustomError } = require('../helpers/errors');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { statusCode } = require('../helpers/constants');
const {
  getUserById,
  getUserByEmail,
  createUser,
  updateToken,
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

  const payload = { id: user.id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
  return await updateToken(user.id, token);
};

const logout = async contactId => {
  const user = await getUserById(contactId);
  if (!user) {
    throw new CustomError(statusCode.UNAUTHORIZED, 'Not authorized');
  }
  await updateToken(contactId, null);
};
module.exports = {
  signup,
  login,
  logout,
};
