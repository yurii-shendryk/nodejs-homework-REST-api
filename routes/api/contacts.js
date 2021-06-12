const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  replace,
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
router.put('/:contactId', validateReplaceContact, replace);
router.delete('/:contactId', remove);

module.exports = router;
