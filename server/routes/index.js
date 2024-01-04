const express = require('express');
const router = express.Router();
const serviceApi = require('./api/services')

// routes
router.use('/services', serviceApi);

module.exports = router;