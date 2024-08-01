const express = require("express");
const router = express.Router();
const { createCompany, showCompanies, singleCompany, deleteCompany, updateCompany } = require("../controllers/companyController");
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const logoUpload = require("../middleware/logoUpload");


// Create company route with upload middleware
router.post("/company/create", logoUpload.single("companyLogo"),isAuthenticated,isAdmin, createCompany);
//single company
router.get('/company/:id',singleCompany)
//show companies
router.get('/companies/show',showCompanies);
//delete
router.delete('/company/delete/:company_id',isAuthenticated,isAdmin,deleteCompany)
//update
router.put('/company/update/:company_id', logoUpload.single("companyLogo"),isAuthenticated,isAdmin,updateCompany)


module.exports = router;
