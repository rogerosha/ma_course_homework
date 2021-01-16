const { Router } = require('@awaitjs/express');
const { csvAdapter } = require('../../db');
const {
  task1,
  task2,
  task3,
  setStore,
  switchStore,
  getUploadFileList,
  optimizeJson,
} = require('../controller.js');
const { csvUploadFile, readFile } = require('../csvUploadFile');

const router = Router();

router.get('/task1', task1);
router.get('/task2', task2);
router.get('/task3', task3);

router.post('/store', setStore);
router.get('/store/switch', switchStore);

router.getAsync('/upload', async (req, res) => {
  try {
    const fileList = await getUploadFileList();
    res.json(fileList);
  } catch (err) {
    console.error('Failed to get file list', err);
    res.status(500).json({ status: 'error' });
  }
});

router.postAsync('/upload/csv', async (req, res) => {
  try {
    console.log(new Date(), 'DEBUG: Uploading the file...');
    const fileName = await csvUploadFile(req);
    console.log(new Date(), 'DEBUG: Optimizing the file...');
    await optimizeJson(fileName);
    console.log(new Date(), 'DEBUG: Reading the file...');
    const fileJson = await readFile(fileName);
    console.log(new Date(), 'DEBUG: Filling the db...');
    await csvAdapter.fillDatabaseFromJSON(fileJson);
    res.status(201).json({ status: 'Your file optimized and sent to DB', fileName });
  } catch (err) {
    console.error('Failed to upload csv', err);
    res.status(500).json({ status: err.message });
  }
});

router.putAsync('/upload/optimize/:fileName', async (req, res) => {
  const { fileName } = req.params;
  try {
    await getUploadFileList();
  } catch (err) {
    res.status(500).json({ status: 'error' });
    return;
  }
  await optimizeJson(fileName).catch((err) => {
    console.error('Something goes wrong', err);
    res.status(500).json({ status: 'error' });
  });
  res.status(202).json({ status: 'okay' });
});

module.exports = {
  router,
};
