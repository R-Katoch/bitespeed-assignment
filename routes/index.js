const express = require('express');

const router = express.Router();
const { identifyContact } = require('../controller/contactController');
const { validateIdentifyRequest } = require('../middleware/validateIdentifyRequest');

// Route to handle identity reconciliation
router.post('/', validateIdentifyRequest, identifyContact);

module.exports = router;
