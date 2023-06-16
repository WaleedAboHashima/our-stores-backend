const router = require("express").Router();
const {GetStores, GetStates, GetNearStores} = require("../controllers/userController");

router.get("/nearstores", GetNearStores);
router.post("/allstores", GetStores)
router.get("/states", GetStates)
module.exports = router;