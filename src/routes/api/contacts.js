const express = require('express');
const router = express.Router();
const {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  removeContactController,
} = require('../../controllers/contactsController');

const {
  validateCreateContact,
  validateUpdateStatusContact,
  validateObjectId,
} = require('../../validation/contactsValidation');

const { asyncWrapper } = require('../../helpers/apiHelpers');

router.get('/', asyncWrapper(getAllContactsController));
router.get(
  '/:contactId',
  validateObjectId,
  asyncWrapper(getContactByIdController)
);
router.post('/', validateCreateContact, asyncWrapper(createContactController));
router.put(
  '/:contactId',
  validateObjectId,
  validateCreateContact,
  asyncWrapper(updateContactController)
);
router.patch(
  '/:contactId/favorite',
  validateObjectId,
  validateUpdateStatusContact,
  asyncWrapper(updateContactController)
);
router.delete(
  '/:contactId',
  validateObjectId,
  asyncWrapper(removeContactController)
);
module.exports = router;
