const router = require('express').Router();
const { AddProduct } = require('../controllers/adminController');

router.post('/addproduct', AddProduct);

module.exports = router;