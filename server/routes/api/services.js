const express = require('express');
const router = express.Router();
const servicesController = require('../../controllers/app/servicesController.js');
const spotifyDownloaderController = require('../../controllers/spotify/downloaderController.js');

router.route('/')
    .post(servicesController.insert)
    .get(servicesController.show);

router.route('/service1/')
    .post(spotifyDownloaderController.start)

module.exports = router;