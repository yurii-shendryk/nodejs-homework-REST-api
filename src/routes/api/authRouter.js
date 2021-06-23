const express = require('express');
const router = express.Router();
const {
  signupUserController,
  loginUserController,
  logoutUserController,
} = require('../../controllers/authController');

const { asyncWrapper } = require('../../helpers/apiHelpers');

const { authGuard } = require('../../middlewares/authMiddleware');

router.post('/signup', asyncWrapper(signupUserController));
router.post('/login', asyncWrapper(loginUserController));
router.post('/logout', authGuard, asyncWrapper(logoutUserController));

module.exports = router;
