// middleware/videoUploadMiddleware.js

import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Generic video upload middleware factory
const videoUpload = ({
  folder = "videos",
  fieldName = "videos",
  allowedTypes = ["video/mp4", "video/webm", "video/quicktime"],
  maxCount = 2,
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
        return cb(new Error("Unsupported video file type."), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit (adjustable)
    },
  });

  const handleVideoUpload = (req, res, next) => {
    if (req.files && req.files.length > 0) {
      req.uploadedVideos = req.files.map((file) => ({
        originalname: file.originalname,
        filename: file.filename,
        path: `/uploads/${folder}/${file.filename}`,
        mimetype: file.mimetype,
      }));
    }
    next();
  };

  return [upload.array(fieldName, maxCount), handleVideoUpload];
};

//
// ✨ Middleware Variants
//

// Video Upload for Support Tickets, Tutorials, etc.
export const uploadSupportVideos = videoUpload({
  folder: "ticket-videos",
  fieldName: "videos",
  maxCount: 2,
});
