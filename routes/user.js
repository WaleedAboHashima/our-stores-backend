const router = require("express").Router();
const {GetStores, GetStates, GetNearStores, GetRules, GetProfile, GetOrderHistory, AddOrder, UpdateUserInfo} = require("../controllers/userController");

router.get("/nearstores", GetNearStores);
router.post("/allstores", GetStores)
router.get("/states", GetStates)
router.get('/rules', GetRules);
router.get('/history/', GetOrderHistory)
router.get('/userInfo', GetProfile)
router.put('/updateinfo', UpdateUserInfo)
router.post('/addOrder', AddOrder)
module.exports = router;