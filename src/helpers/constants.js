const path = require('path');
const statusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

const subscription = {
  starter: 'starter',
  pro: 'pro',
  business: 'business',
};

const temporaryAvatarsFolder = path.join(process.cwd(), process.env.UPLOAD_DIR);
const finalAvatarsFolder = path.join(
  process.cwd(),
  'public',
  process.env.AVATARS_FOLDER
);

module.exports = {
  statusCode,
  subscription,
  temporaryAvatarsFolder,
  finalAvatarsFolder,
};
