require('dotenv').config();
const app = require('../app');
const db = require('../src/db/connect');
const { createFolderIsNotExist } = require('../src/helpers/createFolder');
const {
  temporaryAvatarsFolder,
  finalAvatarsFolder,
} = require('../src/helpers/constants');

const PORT = process.env.PORT || 3000;
db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExist(temporaryAvatarsFolder);
    await createFolderIsNotExist(finalAvatarsFolder);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(error => {
  console.log(`Server not running. Error message: ${error.message}`);
});
