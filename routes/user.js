const router = require("express").Router();
const {GetStores, GetStates} = require("../controllers/userController");

router.get("/stores", GetStores);
router.get("/states", GetStates)
module.exports = router;