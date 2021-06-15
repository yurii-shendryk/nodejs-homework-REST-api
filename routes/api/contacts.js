const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../../controllers/contactsController');

const {
  validateCreateContact,
  validateUpdateContact,
  validateReplaceContact,
} = require('../../validation/contactsValidation');

router.get('/', getAll);
router.get('/:contactId', getById);
router.post('/', validateCreateContact, create);
router.patch('/:contactId', validateUpdateContact, update);
router.put('/:contactId', validateReplaceContact, update);
router.delete('/:contactId', remove);

module.exports = router;
