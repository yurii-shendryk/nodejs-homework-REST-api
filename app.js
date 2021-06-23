const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');

const { statusCode } = require('./src/helpers/constants');
const { errorHandler } = require('./src/helpers/apiHelpers');

const contactsRouter = require('./src/routes/api/contacsRouter');
const authRouter = require('./src/routes/api/authRouter');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/users', authRouter);

app.use((req, res, next) => {
  res.status(statusCode.NOT_FOUND).json({
    message: 'Not found',
  });
});

app.use(errorHandler);

module.exports = app;
