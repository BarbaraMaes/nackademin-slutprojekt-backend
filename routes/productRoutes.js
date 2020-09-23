const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

//get all products
router.get('/', productController.getAllProducts);

//get product with given ID
router.get('/:productId', productController.getProduct);

//post a new product (only admin)
router.post('/', auth.authenticate, auth.isAdmin, productController.createProduct);

//update a product with given ID (only admin)
router.patch('/:productId', auth.authenticate, auth.isAdmin, productController.updateProduct);

//Delete a product with given ID (only admin)
router.delete('/:productId', auth.authenticate, auth.isAdmin, productController.deleteProduct);

module.exports = router;
