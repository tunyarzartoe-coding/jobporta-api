const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { createJob, singleJob, updateJob, showJobs, jobsByCompanyId } = require('../controllers/jobsController');
const router = express.Router();


//jobs Routes

//create job
router.post('/job/create',isAuthenticated,createJob)

//single job
router.get('/job/:id',singleJob)

//jobByCompanyId
router.get('/jobByCompanyId/:company_id',jobsByCompanyId)


//edit job
router.put('/job/update/:job_id',isAuthenticated,updateJob)

//show jobs
router.get('/jobs/show',showJobs);

//all jobs
// router.get('/jobType/jobs',isAuthenticated,)

module.exports = router;