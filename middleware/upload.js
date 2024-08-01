const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
var fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = "./uploads/devices";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "./uploads/devices");
  },
  filename: (req, file, cb) => {
    req.body.image = file;
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});

module.exports = uploadMiddleware;
