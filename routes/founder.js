const { AddRules } = require('../controllers/founderController');

const router = require('express').Router();

router.post('/rules', AddRules)

module.exports = router;