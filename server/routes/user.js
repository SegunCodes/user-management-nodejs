const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//route
router.get('/', userController.view);
router.get('/viewuser/:id', userController.viewAll);
router.post('/', userController.find);
router.get('/:id', userController.delete);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);


module.exports = router;