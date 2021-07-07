const contacts = [
  {
    favorite: false,
    _id: '60df16b0f01fb32058aa67bb',
    name: 'Mango',
    email: 'Mango@mail.com',
    phone: '111 222 333',
    owner: {
      _id: '60de0c955309200850d80fad',
    },
  },
  {
    favorite: false,
    _id: '60df16cff01fb32058aa67be',
    name: 'Poly',
    email: 'Poly@mail.com',
    phone: '444 555 666',
    owner: {
      _id: '60de0c955309200850d80fad',
    },
  },
];

const newContact = {
  name: 'Contact',
  email: 'email@mail.com',
  phone: '111 555 666',
};

const user = {
  _id: '60de0c955309200850d80fad',
  subscription: 'starter',
  token: null,
  email: 'test@gmail.com',
  password: '$2a$06$vTBCzdIAkCv4WNS7dAB10uAPL/nohSj8k5oMMGwm.WKrqfY2gu1Eu',
  avatarURL:
    'https://s.gravatar.com/avatar/19f01b7dc26071aad411381b9b8aee0c?s=250',
};

const users = [];
users[0] = user;

const newUser = {
  email: 'test@mail.com',
  password: 'test123',
};

module.exports = {
  contacts,
  newContact,
  user,
  users,
  newUser,
};
