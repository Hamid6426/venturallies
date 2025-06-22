// middleware/imageUpload.js

import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Generic image upload + processing middleware factory
const imageUpload = ({
  folder,
  fieldName,
  maxCount = 1,
  resizeWidth = 512,
  resizeHeight = null,
  format = "webp",
}) => {
  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed."), false);
      }
      cb(null, true);
    },
  });

  const uploadPath = path.resolve(`uploads/${folder}`);
  fs.mkdirSync(uploadPath, { recursive: true });

  const processImages = async (req, res, next) => {
    const files = req.files;
    if (!files || files.length === 0) return next();

    try {
      const processedFiles = [];

      await Promise.all(
        files.map(async (file) => {
          const filename = `${uuidv4()}.${format}`;
          const outputPath = path.join(uploadPath, filename);

          let imageProcessor = sharp(file.buffer).resize({
            width: resizeWidth,
            ...(resizeHeight && { height: resizeHeight }),
            fit: "cover", // Ensures consistent aspect ratio
          });

          await imageProcessor.toFormat(format).toFile(outputPath);

          processedFiles.push({
            originalname: file.originalname,
            filename,
            path: outputPath,
          });
        })
      );

      // Optional: Attach to request for controller access
      req.processedFiles = processedFiles;

      return next();
    } catch (error) {
      console.error("Image processing failed:", error);
      return res.status(500).json({ message: "Image processing failed." });
    }
  };

  return [upload.array(fieldName, maxCount), processImages];
};

//
// ✨ Middleware Variants
//

// Avatar Upload (1:1 ratio thumbnail)
export const uploadAvatar = imageUpload({
  folder: "avatars",
  fieldName: "avatar",
  resizeWidth: 128,
  resizeHeight: 128,
  maxCount: 1,
});

// Venture Images Upload (landscape)
export const uploadVentureImages = imageUpload({
  folder: "ventures",
  fieldName: "images",
  resizeWidth: 1000,
  maxCount: 1, // 1 image per request
});

export const uploadTicketAttachments = imageUpload({
  folder: "tickets",
  fieldName: "attachments",
  resizeWidth: 800,
  maxCount: 5,
});

// Add Balance Proof Upload (e.g., bank receipt or screenshot)
export const uploadAddBalanceProof = imageUpload({
  folder: "balance_proofs",
  fieldName: "proof",
  resizeWidth: 800, // adjust size if needed
  maxCount: 1,
});
