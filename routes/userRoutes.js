const express = require('express');
const router = express.Router();
const { allUsers, singleUser, editUser, deleteUser, createJobHistory } = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');


//user routes

// /api/allusers
router.get('/admin/allusers', isAuthenticated,isAdmin, allUsers);
//singleUser
router.get('/user/:id',isAuthenticated,singleUser);
//editUser
router.put('/user/edit/:id',isAuthenticated,editUser);
//deleteUser
router.delete('/admin/user/delete/:id',isAuthenticated,isAdmin,deleteUser)
//create JobHistory
router.post('/user/jobhistory',isAuthenticated,createJobHistory)


module.exports = router;