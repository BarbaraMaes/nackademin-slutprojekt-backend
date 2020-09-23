const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

//get all orders (admin/customer)
router.get('/', auth.authenticate, orderController.getOrders);

//Post new order
router.post('/', auth.anonymous, orderController.createOrder);

module.exports = router;
