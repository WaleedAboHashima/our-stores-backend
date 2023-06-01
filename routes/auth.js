const router = require("express").Router();
const {LoginHandler, RegisterHandler} = require("../controllers/auth");

router.post("/login", LoginHandler);
router.post("/register", RegisterHandler);

module.exports = router;