const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const {
    getAllProducts,
    getAllProductsStatic,
} = require('../controllers/product');

router.route('/').get(authMiddleware, getAllProducts);
router.route('/static').get(authMiddleware, getAllProductsStatic);

module.exports = router;
