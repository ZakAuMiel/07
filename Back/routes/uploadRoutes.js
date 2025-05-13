const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multerConfig');
const uploadController = require('../controllers/uploadController');

router.post('/', multer.single('media'), uploadController.handleUpload);

module.exports = router;