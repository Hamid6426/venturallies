import mongoose from "mongoose";
import Venture from "../../../models/Venture.js";

const addVentureImage = async (req, res) => {
  try {
    const { ventureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ventureId)) {
      return res.status(400).json({ message: "Invalid Venture ID." });
    }

    if (!req.processedFiles || req.processedFiles.length === 0) {
      return res.status(400).json({ message: "No images were uploaded." });
    }

    const venture = await Venture.findOne({ _id: ventureId, isDeleted: false });
    if (!venture) {
      return res.status(404).json({ message: "Venture not found." });
    }

    const current = venture.images.length;
    const adding = req.processedFiles.length;

    if (current + adding > 4) {
      return res.status(400).json({
        message: `Max 4 images allowed. Currently: ${current}, Trying to add: ${adding}`,
      });
    }

    const newPaths = req.processedFiles.map((f) => `/uploads/ventures/${f.filename}`);

    if (!newPaths.every((p) => p.startsWith("/uploads/ventures/"))) {
      return res.status(400).json({ message: "Invalid image path detected." });
    }

    const updated = await Venture.findByIdAndUpdate(
      ventureId,
      { $push: { images: { $each: newPaths } } },
      { new: true }
    );

    return res.status(200).json({
      message: "Images added successfully.",
      data: { images: updated.images },
    });
  } catch (err) {
    console.error("patchVentureImage error:", err);
    return res.status(500).json({ message: "Failed to upload venture images." });
  }
};

export default addVentureImage;
