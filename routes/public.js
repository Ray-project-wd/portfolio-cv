const express = require('express');
const pub = require('../controllers/publicController');
const cv = require('../controllers/cvController');

const router = express.Router();

router.get('/', pub.home);
router.get('/projects/:id(\\d+)', pub.project);
router.get('/cv', cv.preview);
router.get('/cv/download', cv.download);

module.exports = router;
