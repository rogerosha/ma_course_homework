const { Router } = require('@awaitjs/express');

const {
  task1,
  task2,
  task3,
  setStore,
  switchStore,
  getUploadFileList,
  optimizeJson,
} = require('./controller.js');
const { notFound } = require('./middlewares/errorHandler.js');
const { csvUploadFile } = require('./csvUploadFile');

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
    const fileName = await csvUploadFile(req);
    res.status(201).json({ status: 'your file uploaded', fileName });
  } catch (err) {
    console.error('Failed to upload csv', err);
    res.status(500).json({ status: err.message });
  }
});

router.put('/upload/optimize/:fileName', async (req, res) => {
  const { fileName } = req.params;
  try {
    await getUploadFileList();
  } catch (err) {
    res.json({ status: 500 });
    return;
  }
  optimizeJson(fileName).catch((err) => {
    console.error('Something goes wrong', err);
    res.json({ status: 'error' }, 500);
  });
  res.json({ status: 'okay' }, 202);
});

router.use(notFound);

module.exports = {
  router,
};
