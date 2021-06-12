const { statusCode } = require('../helpers/constants');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  replaceContact,
} = require('../model/index');

const getAll = async (req, res, next) => {
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
};

const getById = async (req, res, next) => {
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
};

const create = async (req, res, next) => {
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
};

const update = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const updatedContact = await updateContact(id, req.body);
    const contact = await getContactById(id);
    if (contact) {
      res.status(statusCode.OK).json({
        status: 'success',
        code: statusCode.OK,
        data: { updatedContact },
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
};

const replace = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const updatedContact = await replaceContact(id, req.body);
    const contact = await getContactById(id);
    if (contact) {
      res.status(statusCode.OK).json({
        status: 'success',
        code: statusCode.OK,
        data: { updatedContact },
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
};

const remove = async (req, res, next) => {
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
};
module.exports = {
  getAll,
  getById,
  create,
  update,
  replace,
  remove,
};
