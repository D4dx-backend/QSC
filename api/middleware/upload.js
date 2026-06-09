const multer = require("multer");
const fs = require("fs");

const getUploadMiddleware = (folderPath, fields = []) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
      const newFile = file.fieldname + "-" + Date.now() + ext;
      const filePath = folderPath + "/" + newFile;

      // Only set the field if it's not already set or if it's empty
      if (!req.body[file.fieldname] || req.body[file.fieldname] === "") {
        req.body[file.fieldname] = filePath;
      }

      cb(null, newFile);
    },
  });

  const upload = multer({ storage: storage });

  // Create an array of field objects based on the 'fields' parameter
  const uploadFields = fields.map((fieldName) => ({
    name: fieldName,
    maxCount: 1,
  }));

  const uploadMiddleware = upload.fields(uploadFields);

  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return next(err);
      }

      // Clean up the request body - remove any fields that are not strings or are empty
      const fieldsToClean = fields || [];
      fieldsToClean.forEach((fieldName) => {
        const value = req.body[fieldName];
        if (value && typeof value !== "string") {
          // If it's not a string, remove it
          delete req.body[fieldName];
        } else if (value === "" || value === null || value === undefined) {
          // If it's empty, remove it
          delete req.body[fieldName];
        }
      });

      next();
    });
  };
};

module.exports = getUploadMiddleware;
