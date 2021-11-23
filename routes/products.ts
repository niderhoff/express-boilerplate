const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
import {
    getAllProducts,
    getAllProductsStatic,
} from '../controllers/product';

router.route('/').get(authMiddleware, getAllProducts);
router.route('/static').get(authMiddleware, getAllProductsStatic);

export default router;
