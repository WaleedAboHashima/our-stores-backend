const { AddRules, GetAllUsers, GetAllStores } = require('../controllers/founderController');

const router = require('express').Router();

router.post('/rules', AddRules)
router.get('/allusers', GetAllUsers)
router.get('/allstores', GetAllStores)
module.exports = router;