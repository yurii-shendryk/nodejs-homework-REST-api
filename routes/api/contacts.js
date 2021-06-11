const express = require('express');
const router = express.Router();

const { statusCode } = require('../../helpers/constants');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../model/index');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(statusCode.OK).json({
      status: 'success',
      code: statusCode.OK,
      data: { contacts },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const contact = await getContactById(id);
    if (contact) {
      res.status(statusCode.OK).json({
        status: 'success',
        code: statusCode.OK,
        data: { contact },
      });
    } else {
      return next({
        status: statusCode.NOT_FOUND,
        message: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.status(statusCode.CREATED).json({
      status: 'success',
      code: statusCode.CREATED,
      message: 'contact created',
      data: { newContact },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId;
    if (req.body) {
      const updatedContactList = await updateContact(id, req.body);
      res.status(statusCode.OK).json({
        status: 'success',
        code: statusCode.OK,
        data: { updatedContactList },
      });
    } else {
      return next({
        status: statusCode.BAD_REQUEST,
        message: 'missing fields',
      });
    }
  } catch (error) {
    next(error);
  }
});

// router.patch('/:contactId/phone', async (req, res, next) => {
//   res.json({ message: 'template message' });
// });

router.delete('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const conactsList = await listContacts();
    const idList = conactsList.map(contact => contact.id);
    if (idList.some(contactId => contactId === Number(id))) {
      const newContactList = await removeContact(id);
      res.status(statusCode.OK).json({
        status: 'success',
        code: statusCode.OK,
        data: { newContactList },
      });
    } else {
      return next({
        status: statusCode.NOT_FOUND,
        message: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
