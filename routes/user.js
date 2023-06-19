const router = require("express").Router();
const {GetStores, GetStates, GetNearStores, GetRules, GetProfile} = require("../controllers/userController");

router.get("/nearstores", GetNearStores);
router.post("/allstores", GetStores)
router.get("/states", GetStates)
router.get('/rules', GetRules);
router.get('/:userId', GetProfile)
module.exports = router;