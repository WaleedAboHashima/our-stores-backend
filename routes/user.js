const router = require("express").Router();
const {GetStores, GetStates, GetNearStores, GetRules} = require("../controllers/userController");

router.get("/nearstores", GetNearStores);
router.post("/allstores", GetStores)
router.get("/states", GetStates)
router.get('/rules', GetRules);
module.exports = router;