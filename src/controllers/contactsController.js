const { statusCode } = require('../helpers/constants');

const {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
} = require('../model/contacts');

const getAllContactsController = async (req, res) => {
  const userId = req.user._id;
  const contacts = await getAllContacts(userId, req.query);
  res.status(statusCode.OK).json({
    ...contacts,
  });
};

const getContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  const userId = req.user._id;
  const contact = await getContactById(id, userId);
  res.status(statusCode.OK).json({
    contact,
  });
};

const createContactController = async (req, res) => {
  const userId = req.user._id;
  const newContact = await addContact(req.body, userId);
  res.status(statusCode.CREATED).json({ newContact });
};

const updateContactController = async (req, res) => {
  const id = req.params.contactId;
  const userId = req.user._id;
  const updatedContact = await updateContactById(id, req.body, userId);
  res.status(statusCode.OK).json({
    updatedContact,
  });
};

const removeContactController = async (req, res) => {
  const id = req.params.contactId;
  const userId = req.user._id;
  await removeContactById(id, userId);
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
