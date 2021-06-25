/* eslint-disable no-useless-catch */
const { Contact } = require('../schemas/contactModel');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const getAllContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
    limit = 5,
    page,
  } = query;
  const optionsSearch = { owner: userId };
  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }
  console.log(optionsSearch);
  const { docs: contacts, totalDocs: total } = await Contact.paginate(
    optionsSearch,
    {
      limit,
      page,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split('|').join(' ') : '',
      populate: {
        path: 'owner',
        select: 'email -_id',
      },
    }
  );
  if (contacts.length === 0 && page) {
    throw new CustomError(
      statusCode.UNPROCESSABLE_ENTITY,
      `page ${page} does not contain any content`
    );
  }

  return page ? { contacts, total, limit, page: Number(page) } : { contacts };
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email -_id',
  });
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  return result;
};

const addContact = async (body, userId) => {
  const result = new Contact({ ...body, owner: userId });
  await result.save();
  return result;
};

const updateContactById = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    {
      $set: { ...body },
    },
    { new: true }
  ).populate({
    path: 'owner',
    select: 'email -_id',
  });
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  return result;
};

const removeContactById = async (contactId, userId) => {
  const result = await Contact.findOneAndRemove({ _id: contactId, userId });
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
