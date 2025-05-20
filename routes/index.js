const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController.js');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.get('/', mainController.index);
router.get('/products/create', mainController.create);
router.get('/products/edit/:id', mainController.edit);

router.post('/products/importExcel', upload.single('excel'), mainController.importExcel);
router.post('/generateqr/:id', mainController.generateQRCode);
router.post('/products/search', mainController.search);
router.post('/products', mainController.store);
router.post('/products/update/:id', mainController.update);
router.post('/products/delete/:id', mainController.delete);

module.exports = router;