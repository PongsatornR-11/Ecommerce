const express = require('express')
const router = express.Router()

// import middle ware
const { authCheck, adminCheck } = require('../middlewares/authCheck')

// import controller
const { changeOrderStatus, getOrderAdmin } = require('../controllers/admin')

router.put('/admin/order-status', authCheck, adminCheck, changeOrderStatus)
router.get('/admin/orders', authCheck, adminCheck, getOrderAdmin)

module.exports = router