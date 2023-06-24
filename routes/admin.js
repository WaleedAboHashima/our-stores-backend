const router = require('express').Router();
const { AddProduct } = require('../controllers/adminController');
const imgUploader = require('../middleware/imgUploader');

router.post('/addproduct', imgUploader.fields([{ name: "imgs" ,maxCount:3}]) ,AddProduct);

module.exports = router;