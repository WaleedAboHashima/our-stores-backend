const router = require("express").Router();
const {GetStores} = require("../controllers/userController");

router.get("/stores", GetStores);

module.exports = router;