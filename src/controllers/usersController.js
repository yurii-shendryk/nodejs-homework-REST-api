const { statusCode } = require('../helpers/constants');

const { signup, login, updateUser } = require('../services/usersService');

const { updateToken } = require('../model/users');

const signupUserController = async (req, res) => {
  const { email, password } = req.body;
  const user = await signup(email, password);
  res.status(statusCode.CREATED).json({
    user: {
      email: user.email,
      subscription: user.subscription,
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
  const updatedUser = await updateUser(userId, req.body);
  res.status(statusCode.OK).json({
    currentUser: {
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    },
  });
};

module.exports = {
  signupUserController,
  loginUserController,
  logoutUserController,
  getCurrentUserController,
  updateUserSubscriptionController,
};
