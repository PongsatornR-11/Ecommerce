const express = require('express');
const router = express.Router();

// import controller functions in controllers folder
const { create, list, remove } = require('../controllers/category')

// endpoint http://localhost:5000/api/category
router.post('/category', create)
router.get('/category', list)
router.delete('/category/:id', remove)


module.exports = router