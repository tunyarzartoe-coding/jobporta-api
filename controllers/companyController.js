const fs = require("fs");
const Company = require("../models/companyModel");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = "./uploads/companyLogo";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "./uploads/companyLogo");
  },
  filename: function (req, file, cb) {
    let generatedName = uuidv4() + path.extname(file.originalname);
    req.body.photo = file;
    cb(null, generatedName);
  },
});

exports.createCompany = async (req, res, next) => {
  try {
    const { companyName, description, companyEmail, location, companyPhone } =
      req.body;
    const user = req.user.id;
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (
      !companyName ||
      !description ||
      !companyEmail ||
      !location ||
      !companyPhone ||
      !req.file ||
      !user
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("Uploaded file:", req.file);

    // const img = fs.readFileSync(req.file.path);
    const companyData = {
      companyName,
      description,
      companyEmail,
      location,
      companyPhone,
      user,
      companyLogo: req.file.path,
    };

    Company.create(companyData, function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating company" });
      }

      console.log("Saved to database");
      res.status(201).json({
        success: true,
        company: result,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.showCompanies = async (req, res, next) => {
  //enable search
  const keyword = req.query.keyword
    ? {
        companyName: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  //jobs by location
  let locations = [];
  const companyByLocation = await Company.find({}, { location: 1 });
  companyByLocation.forEach((val) => {
    locations.push(val.location);
  });
  let setUniqueLocation = [...new Set(locations)];
  let location = req.query.location;
  let locationFilter = location !== "" ? location : setUniqueLocation;

  //enable pagination
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  //const count = await Job.find({}).estimatedDocumentCount();
  const count = await Company.find({
    ...keyword,
    location: locationFilter,
  }).countDocuments();

  try {
    const companies = await Company.find({
      ...keyword,
      location: locationFilter,
    })
      .populate("jobs")
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.status(200).json({
      success: true,
      companies,
      page,
      pages: Math.ceil(count / pageSize),
      count,
      setUniqueLocation,
    });
  } catch (error) {
    next(error);
  }
};

//single company
exports.singleCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate("jobs");
    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};

//delete job type
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndRemove(req.params.company_id);
    res.status(200).json({
      success: true,
      message: "Company is deleted",
    });
  } catch (error) {
    next(new ErrorResponse("server error", 500));
  }
};


exports.updateCompany = async (req, res, next) => {
  try {
    const company = req.body;
    const singleCompany = await Company.findById(req.params.company_id);

    if (!singleCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found with the given ID.",
      });
    }

    if (!req.file && singleCompany.companyLogo) {
      company.companyLogo = singleCompany.companyLogo;
    } else if (singleCompany.companyLogo) {
      fs.unlinkSync(`./uploads/companyLogo/${path.basename(singleCompany.companyLogo)}`);
    }

    if (req.file) {
      company.companyLogo = req.file.path;
    }

    const updateCompany = await Company.findByIdAndUpdate(
      req.params.company_id,
      { $set: company },
      { new: true }
    );

    console.log("updateCompany", updateCompany);

    if (updateCompany) {
      res.status(200).json({ success: true, message: "Company Updated Successfully!" });
    } else {
      res.status(400).json({
        success: false,
        message: "Company Not Updated. There is an error!",
      });
    }
  } catch (err) {
    next(err);
  }
};


