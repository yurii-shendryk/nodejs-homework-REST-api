const { statusCode } = require('../helpers/constants');

const {
  signup,
  login,
  updateUserSybscription,
  saveUserAvatar,
  resendVerificationToken,
} = require('../services/usersService');

const {
  getUserByVerifyToken,
  updateToken,
  updateAvatar,
  updateVerifyToken,
} = require('../model/users');

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
  const id = req.user._id;
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
  const userId = req.user._id;
  const updatedUser = await updateUserSybscription(userId, req.body);
  res.status(statusCode.OK).json({
    currentUser: {
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    },
  });
};

const updateUserAvatarController = async (req, res) => {
  const id = req.user._id;
  const avatar = req.user.avatarURL;
  const avatarURL = await updateAvatar(id, req.file, avatar, saveUserAvatar);
  res.status(statusCode.OK).json({ avatarURL });
};

const verificationUserTokenController = async (req, res) => {
  const verifyToken = req.params.verificationToken;
  const verifiedUser = await getUserByVerifyToken(verifyToken);
  await updateVerifyToken(verifiedUser._id, true, null);
  res.status(statusCode.OK).json({ message: 'Verification successful' });
};

const resendVerificationTokenController = async (req, res) => {
  const { email } = req.body;
  await resendVerificationToken(email);
  res.status(statusCode.OK).json({
    message: 'Verification email sent',
  });
};

module.exports = {
  signupUserController,
  loginUserController,
  logoutUserController,
  getCurrentUserController,
  updateUserSubscriptionController,
  updateUserAvatarController,
  verificationUserTokenController,
  resendVerificationTokenController,
};
