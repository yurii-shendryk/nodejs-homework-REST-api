const { statusCode } = require('../helpers/constants');

const { signup, login, logout } = require('../services/authService');

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
  const id = req.user.id;
  await logout(id);
  res.status(statusCode.NO_CONTENT).json({});
};

module.exports = {
  signupUserController,
  loginUserController,
  logoutUserController,
};
