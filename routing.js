const express = require('express');
const home = require('./controller/home');
const router = express.Router();
const multer = require('multer');
var update = multer();


router.get('/', home.index);

router.post('/verifyotp', [update.any()], home.verifyOtp);

router.get("/app/download", home.appDownload);

router.post("/contact",[update.any()], home.contact);

router.get("/generateChecksum", home.generateChecksum);

router.post("/generateChecksum", [update.any()], home.generateChecksum);

module.exports = router;

