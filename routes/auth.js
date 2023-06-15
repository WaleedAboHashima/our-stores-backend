const router = require("express").Router();
const { LoginHandler, RegisterHandler, ForgetHandler, OTPCheck, UpdatePassword } = require("../controllers/authController");
const { AdminRegister, AdminLogin } = require('../controllers/adminController');
const { FounderLogin } = require('../controllers/founderController');


router.post("/login", LoginHandler);
router.post("/register", RegisterHandler);
router.post("/forget", ForgetHandler);
router.post("/otp", OTPCheck);
router.post("/reset", UpdatePassword);
//Admin
router.post('/store/register', AdminRegister);
router.post('/store/login', AdminLogin);
//Founder
router.post('/founder/login', FounderLogin)

module.exports = router;