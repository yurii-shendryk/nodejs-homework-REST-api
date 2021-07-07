const fs = require('fs/promises');

const isAccessible = async path =>
  await fs
    .access(path)
    .then(() => true)
    .catch(() => false);

const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

module.exports = {
  createFolderIsNotExist,
};
