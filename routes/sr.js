const { AddCustomer, GetMyOrders, GetOrderDetail } = require('../controllers/srController');
const router = require('express').Router();


//Profile
router.post('/addorder/:orderId', AddCustomer)
//Orders
router.get('/myorders', GetMyOrders);
router.get('/order/:orderId', GetOrderDetail);
module.exports = router;