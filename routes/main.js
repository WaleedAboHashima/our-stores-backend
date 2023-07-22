const { GetAllOrders, GetRules, GetProfile, UpdateUserInfo, AddFeedback } = require('../controllers/mainController');

const router = require('express').Router();


// General
router.get('/orders', GetAllOrders);
router.get('/rules', GetRules);

//Profile
router.get('/userInfo', GetProfile)
router.put('/updateinfo', UpdateUserInfo)

//Orders


//Feedback
router.post("/feedback", AddFeedback);

module.exports = router;