const { statusCode } = require('../helpers/constants');

const {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
} = require('../model/index');

const getAllContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.status(statusCode.OK).json({
    contacts,
  });
};

const getContactByIdController = async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await getContactById(id);
  res.status(statusCode.OK).json({
    contact,
  });
};

const createContactController = async (req, res, next) => {
  const newContact = await addContact(req.body);
  res.status(statusCode.CREATED).json({ newContact });
};

const updateContactController = async (req, res, next) => {
  const id = req.params.contactId;
  const updatedContact = await updateContactById(id, req.body);
  res.status(statusCode.OK).json({
   updatedContact 
  });
};

const removeContactController = async (req, res, next) => {
  const id = req.params.contactId;
  await removeContactById(id);
  res.status(statusCode.OK).json({
    message: 'contact deleted',
  });
};
module.exports = {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  removeContactController,
};
