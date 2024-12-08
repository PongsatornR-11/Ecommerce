const express = require('express');
const router = express.Router();

//controller
const { createPaymentIntent } = require('../controllers/stripe');

//middleware
const { authCheck } = require("../middlewares/authCheck");

//routes
router.post('/user/create-payment-intent', authCheck, createPaymentIntent);

module.exports = router;
