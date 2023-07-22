const { AddRules, GetAllUsers, GetAllStores, DeleteUser, DeletStore, GetReports, ArchiveOrder, top3, DeleteReport } = require('../controllers/founderController');

const router = require('express').Router();

router.post('/rules', AddRules)
router.get('/allusers', GetAllUsers)
router.get('/allstores', GetAllStores)
router.get('/reports', GetReports)
router.delete('/user/:userId', DeleteUser)
router.delete('/store/:storeId', DeletStore)
router.delete('/order/:orderId', ArchiveOrder)
router.get('/top3', top3)
router.delete('/report/:repId', DeleteReport)
module.exports = router;