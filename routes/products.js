const express = require('express');

const router = express.Router();
const {
    getAllProducts,
    getAllProductsStatic,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product');

router.route('/').post(createProduct).get(getAllProductsStatic);
router.route('/:id').get(getProduct).delete(deleteProduct).patch(updateProduct);
router.route('/static').get(getAllProductsStatic);

module.exports = router;
