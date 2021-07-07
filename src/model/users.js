/* eslint-disable no-useless-catch */
const { User } = require('../schemas/userModel');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const getUserById = async userId => {
  return await User.findOne({ _id: userId });
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

const updateToken = async (userId, token) =>
  await User.findByIdAndUpdate(userId, { token }, { new: true });

const updateAvatar = async (userId, file, avatar, cb) => {
  const avatarURL = await cb(file, avatar);
  await User.findByIdAndUpdate(userId, { avatarURL }, { new: true });
  return avatarURL;
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateToken,
  updateUserById,
  updateAvatar,
};
