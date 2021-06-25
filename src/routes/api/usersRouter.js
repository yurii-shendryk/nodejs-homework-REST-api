const express = require('express');
const router = express.Router();

const { authGuard } = require('../../middlewares/authMiddleware');

const {
  validateCreateUser,
  validateUpdateUserSubscription,
} = require('../../middlewares/validationMiddlewares');

const { asyncWrapper } = require('../../helpers/apiHelpers');

const {
  signupUserController,
  loginUserController,
  logoutUserController,
  getCurrentUserController,
  updateUserSubscriptionController,
} = require('../../controllers/usersController');

router.get('/current', authGuard, asyncWrapper(getCurrentUserController));

router.post('/signup', validateCreateUser, asyncWrapper(signupUserController));
router.post('/login', validateCreateUser, asyncWrapper(loginUserController));
router.post('/logout', authGuard, asyncWrapper(logoutUserController));

router.patch(
  '/subscription',
  authGuard,
  validateUpdateUserSubscription,
  asyncWrapper(updateUserSubscriptionController)
);

module.exports = router;
