/* eslint-disable no-useless-catch */
const fs = require('fs').promises;
const path = require('path');

const contacts = path.join(__dirname, './contacts.json');

const generateId = arrayOfNumbers => {
  const idList = arrayOfNumbers.map(({ id }) => id);
  const maxId = arrayOfNumbers.length === 0 ? 0 : Math.max.apply(null, idList);
  const id = maxId + 1;
  return id;
};

const listContacts = async () => {
  try {
    const contactsList = await fs.readFile(contacts, 'utf8');
    const parsedContactsList = JSON.parse(contactsList);
    return parsedContactsList;
  } catch (error) {
    throw error;
  }
};

const getContactById = async contactId => {
  try {
    const contactsList = await listContacts();
    const contactById = contactsList.find(({ id }) => Number(contactId) === id);
    return contactById;
  } catch (error) {
    throw error;
  }
};

const addContact = async body => {
  try {
    const contactsList = await listContacts();
    const id = generateId(contactsList);
    const { name, email, phone } = body;
    const newContact = { id, name, email, phone };
    const newContactList = [...contactsList, newContact];
    await fs.writeFile(contacts, JSON.stringify(newContactList), 'utf8');
    return newContact;
  } catch (error) {
    throw error;
  }
};

const removeContact = async contactId => {
  try {
    const contactsList = await listContacts();
    const newContactList = contactsList.filter(
      ({ id }) => Number(contactId) !== id
    );
    await fs.writeFile(contacts, JSON.stringify(newContactList), 'utf8');
    return newContactList;
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const contactsList = await listContacts();
    const updatedContactList = contactsList.map(contact =>
      contact.id === Number(contactId)
        ? {
            ...contact,
            name,
            email,
            phone,
          }
        : contact
    );
    await fs.writeFile(contacts, JSON.stringify(updatedContactList), 'utf8');
    return updatedContactList;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
