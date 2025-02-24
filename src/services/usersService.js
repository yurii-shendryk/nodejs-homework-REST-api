/* eslint-disable no-useless-catch */
const jwt = require('jsonwebtoken');
const { uuid } = require('uuidv4');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const { CustomError } = require('../helpers/errors');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { statusCode, finalAvatarsFolder } = require('../helpers/constants');
const {
  getUserByEmail,
  createUser,
  updateUserById,
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
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
  const result = await updateToken(user._id, token);
  return result;
};

const updateUserSybscription = async (userId, body) =>
  await updateUserById(userId, body);

const saveUserAvatar = async (file, avatar) => {
  const pathName = file.path;
  const newAvatar = `${uuid()}-${file.originalname}`;
  const img = await Jimp.read(pathName);
  await img.autocrop().cover(250, 250).writeAsync(pathName);
  try {
    await fs.rename(pathName, path.join(`${finalAvatarsFolder}`, newAvatar));
  } catch (error) {
    await fs.unlink(pathName);
    throw error;
  }
  if (avatar.includes(`${process.env.AVATARS_FOLDER}/`)) {
    await fs.unlink(path.join(process.cwd(), 'public', avatar));
  }
  return path.join(process.env.AVATARS_FOLDER, newAvatar).replace('\\', '/');
};

module.exports = {
  signup,
  login,
  updateUserSybscription,
  saveUserAvatar,
};
