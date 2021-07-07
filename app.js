const express = require('express');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const boolParser = require('express-query-boolean');
const app = express();

const { statusCode } = require('./src/helpers/constants');
const { errorHandler } = require('./src/helpers/apiHelpers');
const contactsRouter = require('./src/routes/api/contacsRouter');
const authRouter = require('./src/routes/api/usersRouter');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.get('env') !== 'test' && app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(boolParser());

app.use(express.static('public'));

app.use('/api/contacts', contactsRouter);
app.use('/api/users', authRouter);

app.use((req, res, next) => {
  res.status(statusCode.NOT_FOUND).json({
    message: 'Not found',
  });
});

app.use(errorHandler);

module.exports = app;
