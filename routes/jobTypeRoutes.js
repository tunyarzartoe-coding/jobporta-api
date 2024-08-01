const express = require('express');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { createJobType, allJobsType, updateJobType, deleteJobType } = require('../controllers/jobTypeController');
const router = express.Router();


//jobType Routes

//create jobType
router.post('/type/create',isAuthenticated,createJobType)
//All jobType
router.get('/type/jobs',allJobsType)
//Edit jobType
router.put('/type/update/:type_id',isAuthenticated,isAdmin,updateJobType)
//Delete jobType
router.delete('/type/delete/:type_id',isAuthenticated,isAdmin,deleteJobType)


module.exports = router;