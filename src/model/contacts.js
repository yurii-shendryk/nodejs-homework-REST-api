/* eslint-disable no-useless-catch */
const { Contact } = require('../schemas/contactModel');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const getAllContacts = async () => {
  const result = await Contact.find({});
  return result;
};

const getContactById = async contactId => {
  const result = await Contact.findById(contactId);
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  return result;
};

const addContact = async body => {
  const result = new Contact({ ...body });
  await result.save();
  return result;
};

const updateContactById = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    contactId,
    {
      $set: { ...body },
    },
    { new: true }
  );
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  return result;
};

const removeContactById = async contactId => {
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
};
