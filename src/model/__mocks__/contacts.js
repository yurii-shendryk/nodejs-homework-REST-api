/* eslint-disable no-useless-catch */
const { contacts } = require('./data');

const getAllContacts = jest.fn((userId, query) => {
  const { limit = 5, page = 1 } = query;
  const allContacts = contacts.filter(
    ({ owner }) => String(userId) === String(owner._id)
  );
  return { allContacts, total: allContacts.length, limit, page: Number(page) };
});

const getContactById = jest.fn((contactId, userId) => {
  const contact = contacts.find(
    ({ _id, owner }) =>
      String(_id) === String(contactId) && String(owner._id) === String(userId)
  );
  if (!contact) {
    throw null;
  }
  return contact;
});

const addContact = jest.fn((body, userId) => {
  const newContact = {
    ...body,
    _id: '60df16cff01fb32058aa67bd',
    owner: { _id: userId },
  };
  contacts.push(newContact);
  return newContact;
});

const updateContactById = jest.fn((contactId, body, userId) => {
  let contact = getContactById(contactId, userId);
  if (contact) {
    contact = { ...contact, ...body };
  }
  return contact;
});

const removeContactById = jest.fn((contactId, userId) => {
  const index = contacts.findIndex(
    ({ _id, owner }) =>
      String(_id) === String(contactId) && String(owner._id) === String(userId)
  );
  if (index === -1) {
    throw null;
  }
  contacts.splice(index, 1);
});

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
};
