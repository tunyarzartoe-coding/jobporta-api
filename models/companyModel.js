const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      trim: true,
      required: [true, "Company Name is required"],
    },
    companyLogo: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    companyEmail: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
    },
    companyPhone: {
      type: String,
      trim: true,
      required: [true, "Phone is required"],
    },
    location: {
      type: String,
    },
    
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    jobs: {
      type: ObjectId,
      ref: "Job",
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
