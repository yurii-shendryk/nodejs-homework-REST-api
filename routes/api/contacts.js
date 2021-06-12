const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../../controllers/contactsController');

router.get('/', getAll);
router.get('/:contactId', getById);
router.post('/', create);
router.put('/:contactId', update);
router.delete('/:contactId', remove);

module.exports = router;
