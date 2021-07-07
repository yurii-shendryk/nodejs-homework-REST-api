/* eslint-disable no-useless-catch */
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;
const { users, newUser } = require('./data');

const getUserById = jest.fn(id => {
  const user = users.find(el => String(el._id) === String(id));
  return user;
});

const getUserByEmail = jest.fn(email => {
  const user = users.find(el => String(el.email) === String(email));
  return user;
});

const createUser = jest.fn((email, password) => {
  const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR), null);
  const user = {
    ...newUser,
    password: pass,
    _id: '60de0c955309200850d80fcb',
    validPassword: function (pass) {
      return bcrypt.compareSync(pass, this.password);
    },
  };
  users.push(user);
  return user;
});

const updateUserById = jest.fn((userId, body) => {
  let user = getUserById(userId);
  if (!user) {
    throw null;
  }
  user = { ...user, ...body };
  return user;
});

const updateToken = jest.fn((userId, token) => {
  return {};
});

const updateAvatar = jest.fn((userId, file, avatar, cb) => {
  const user = users.find(el => String(el._id) === String(userId));
  cb = jest.fn(() => {
    const newAvatar = 'new avatar url';

    return newAvatar;
  });
  const avatarURL = cb(file, avatar);
  user.avatarURL = avatarURL;
  return avatarURL;
});

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateToken,
  updateUserById,
  updateAvatar,
};
