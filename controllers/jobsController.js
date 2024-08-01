const Job = require("../models/jobModel");
const JobType = require("../models/jobTypeModel");
const Company = require ("../models/companyModel")
const ErrorResponse = require("../utils/errorResponse");

//create job
exports.createJob = async (req, res, next) => {
  try {
    console.log("in the try")
    console.log('Request Body:', req.body);
    console.log('User:', req.user);
    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      salary: req.body.salary,
      location: req.body.location,
      jobType: req.body.jobType,
      company: req.body.company,
      user: req.user.id,
    });
    console.log(job)
    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

//single job
exports.singleJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("jobType").populate("company");
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

//update job by id.
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, {
      new: true,
    })
      .populate("jobType", "jobTypeName")
      .populate("user", "firstName lastName");
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};


exports.showJobs = async (req, res, next) => {
  //enable search
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // filter jobs by category ids
  let ids = [];
  const jobTypeCategory = await JobType.find({}, { _id: 1 });
  jobTypeCategory.forEach((cat) => {
    ids.push(cat._id);
  });

  let cat = req.query.cat;
  let categ = cat !== "" ? cat : ids;

  //jobs by location
  let locations = [];
  const jobByLocation = await Job.find({}, { location: 1 });
  jobByLocation.forEach((val) => {
    locations.push(val.location);
  });
  let setUniqueLocation = [...new Set(locations)];
  let location = req.query.location;
  let locationFilter = location !== "" ? location : setUniqueLocation;

  //enable pagination
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;
  //const count = await Job.find({}).estimatedDocumentCount();
  const count = await Job.find({
    ...keyword,
    jobType: categ,
    location: locationFilter,
  }).countDocuments();

  try {
    const jobs = await Job.find({
      ...keyword,
      jobType: categ,
      location: locationFilter,
    })
      .sort({ createdAt: -1 })
      .populate("jobType")
      .populate("company")
      // .populate("company","companyLogo")
      .populate("user")
      .skip(pageSize * (page - 1))
      .limit(pageSize);

      // console.log(jobs)
    res.status(200).json({
      success: true,
      jobs,
      page,
      pages: Math.ceil(count / pageSize),
      count,
      setUniqueLocation,
    });
  } catch (error) {
    next(error);
  }
};
//single job
exports.jobsByCompanyId = async (req, res, next) => {
  try {
    console.log("in the try")
    const companyId = req.params.company_id;
    // console.log("companyId",companyId)
    const jobs = await Job.find({ company: companyId }).populate('jobType');
    // console.log("jobs",jobs)
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};
