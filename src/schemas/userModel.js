const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { Schema } = mongoose;
const SALT_FACTOR = 6;
const { subscription } = require('../helpers/constants');

const usersSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: [subscription.starter, subscription.pro, subscription.business],
    default: subscription.starter,
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250' }, true);
    },
  },
});

usersSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      bcrypt.genSaltSync(SALT_FACTOR)
    );
  }
  return next();
});

usersSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('user', usersSchema);

module.exports = { User };
