const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const path = require('path')
var fs = require('fs');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './uploads/companyLogo';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, './uploads/companyLogo')
    },
    filename: function (req, file, cb) {
        let generatedName = uuidv4() + path.extname(file.originalname);
        req.body.photo = file;
        cb(null, generatedName)

    }
})

//var upload = multer({ storage: storage })
const logoUpload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    },
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
})

module.exports = logoUpload