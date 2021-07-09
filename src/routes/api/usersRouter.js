const express = require('express');
const router = express.Router();
const { authGuard } = require('../../middlewares/authMiddleware');
const { uploadAvatar } = require('../../helpers/uploadAvatar');
const {
  validateCreateUser,
  validateUpdateUserSubscription,
  validateResendVerificationEmail,
} = require('../../middlewares/validationMiddlewares');

const { asyncWrapper } = require('../../helpers/apiHelpers');

const {
  signupUserController,
  loginUserController,
  logoutUserController,
  getCurrentUserController,
  updateUserSubscriptionController,
  updateUserAvatarController,
  verificationUserTokenController,
  resendVerificationTokenController,
} = require('../../controllers/usersController');

router.get('/current', authGuard, asyncWrapper(getCurrentUserController));
router.get(
  '/verify/:verificationToken',
  asyncWrapper(verificationUserTokenController)
);
router.post('/signup', validateCreateUser, asyncWrapper(signupUserController));
router.post(
  '/verify',
  validateResendVerificationEmail,
  asyncWrapper(resendVerificationTokenController)
);
router.post('/login', validateCreateUser, asyncWrapper(loginUserController));
router.post('/logout', authGuard, asyncWrapper(logoutUserController));
router.patch(
  '/subscription',
  authGuard,
  validateUpdateUserSubscription,
  asyncWrapper(updateUserSubscriptionController)
);
router.patch(
  '/avatars',
  authGuard,
  uploadAvatar.single('avatar'),
  asyncWrapper(updateUserAvatarController)
);

module.exports = router;
