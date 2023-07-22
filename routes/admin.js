const router = require('express').Router();
const { AddProduct, GetAllProducts, DeleteProduct, AddSR } = require('../controllers/adminController');
const imgUploader = require('../middleware/imgUploader');

router.post('/addproduct', imgUploader.fields([{ name: "imgs" ,maxCount:3}]) ,AddProduct);
router.get('/getallproducts', GetAllProducts);
router.delete('/product/:productId', DeleteProduct);
router.post('/addsr', AddSR);
module.exports = router;