const { statusCode } = require('../helpers/constants');

const {
  signup,
  login,
  updateUserSybscription,
  saveUserAvatar,
} = require('../services/usersService');

const { updateToken, updateAvatar } = require('../model/users');

const signupUserController = async (req, res) => {
  const { email, password } = req.body;
  const user = await signup(email, password);
  res.status(statusCode.CREATED).json({
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const loggedInUser = await login(email, password);
  res.status(statusCode.OK).json({
    token: loggedInUser.token,
    user: {
      email: loggedInUser.email,
      subscription: loggedInUser.subscription,
    },
  });
};

const logoutUserController = async (req, res) => {
  const { id } = req.user;
  const { token } = req.user;
  await updateToken(id, token);
  res.status(statusCode.NO_CONTENT).json({});
};

const getCurrentUserController = async (req, res) => {
  const user = req.user;
  res.status(statusCode.OK).json({
    email: user.email,
    subscription: user.subscription,
  });
};

const updateUserSubscriptionController = async (req, res) => {
  const userId = req.user.id;
  const updatedUser = await updateUserSybscription(userId, req.body);
  res.status(statusCode.OK).json({
    currentUser: {
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    },
  });
};

const updateUserAvatarController = async (req, res) => {
  const { id } = req.user;
  const avatar = req.user.avatarURL;
  const avatarURL = await updateAvatar(id, req.file, avatar, saveUserAvatar);
  res.json({ avatarURL });
};

module.exports = {
  signupUserController,
  loginUserController,
  logoutUserController,
  getCurrentUserController,
  updateUserSubscriptionController,
  updateUserAvatarController,
};
