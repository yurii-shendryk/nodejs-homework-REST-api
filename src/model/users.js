/* eslint-disable no-useless-catch */
const { User } = require('../schemas/userModel');

const getUserById = async contactId => {
  return await User.findById(contactId);
};

const getUserByEmail = async email => {
  return await User.findOne({ email });
};

const createUser = async (email, password) => {
  const user = new User({ email, password });
  return await user.save();
};

const updateToken = async (contactId, token) => {
  return await User.findByIdAndUpdate(
    contactId,
    { $set: { token } },
    { new: true }
  );
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateToken,
};
