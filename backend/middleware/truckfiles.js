const multer = require("multer");
var path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/truckdocs");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(null, name + "-" + Date.now() + "." + path.extname(file.originalname));
  }
});

module.exports = multer({ storage: storage }).fields([
  { name: "TLIC"},
  { name: "LIC" },
  { name: "CMRLIC" }
]);
