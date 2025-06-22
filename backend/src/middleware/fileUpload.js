// middleware/fileUpload.js

import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Generic file upload middleware factory
const fileUpload = ({
  folder,
  fieldName,
  allowedTypes = ["application/pdf"],
  maxCount = 3,
}) => {
  const uploadPath = path.resolve(`uploads/${folder}`);
  fs.mkdirSync(uploadPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Unsupported file type."), false);
      }
      cb(null, true);
    },
  });

  const handleUpload = (req, res, next) => {
    // Attach basic metadata to req.uploadedFiles
    if (req.files && req.files.length > 0) {
      req.uploadedFiles = req.files.map((file) => ({
        originalname: file.originalname,
        filename: file.filename,
        path: `/uploads/${folder}/${file.filename}`,
        mimetype: file.mimetype,
      }));
    }
    next();
  };

  return [upload.array(fieldName, maxCount), handleUpload];
};

//
// ✨ Middleware Variants
//

// Support Ticket PDF Upload
export const uploadTicketPDFs = fileUpload({
  folder: "ticket-pdfs",
  fieldName: "documents",
  allowedTypes: ["application/pdf"],
  maxCount: 3,
});
