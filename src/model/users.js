/* eslint-disable no-useless-catch */
const { User } = require('../schemas/userModel');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const getUserById = async contactId => {
  return await User.findOne({ _id: contactId });
};

const getUserByEmail = async email => {
  return await User.findOne({ email });
};

const createUser = async (email, password) => {
  const user = new User({ email, password });
  return await user.save();
};

const updateUserById = async (userId, body) => {
  const result = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: { ...body },
    },
    { new: true }
  );
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  return result;
};

const updateToken = async (contactId, token) => {
  return await User.findByIdAndUpdate(contactId, { token }, { new: true });
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateToken,
  updateUserById,
};
