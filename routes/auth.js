const router = require("express").Router();
const { LoginHandler, RegisterHandler, ForgetHandler, OTPCheck, UpdatePassword } = require("../controllers/authController");
const { AdminRegister, AdminLogin } = require('../controllers/adminController');
const { FounderLogin, FounderRegister } = require('../controllers/founderController');
const imgUploader = require('../middleware/imgUploader');

router.post("/login", LoginHandler);
router.post("/register", RegisterHandler);
router.post("/forget", ForgetHandler);
router.post("/otp", OTPCheck);
router.post("/reset", UpdatePassword);
//Admin
router.post('/store/register', imgUploader.fields([{ name: "logo" ,maxCount:1}]),AdminRegister);
router.post('/store/login', AdminLogin);
//Founder
router.post('/founder/login', FounderLogin)
router.post('/founder/register', FounderRegister)

module.exports = router;