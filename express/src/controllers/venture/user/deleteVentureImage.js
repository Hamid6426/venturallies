import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import Venture from "../../../models/Venture.js";

const deleteVentureImage = async (req, res) => {
  try {
    const { ventureId } = req.params;
    const { imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ventureId)) {
      return res.status(400).json({ message: "Invalid Venture ID." });
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required." });
    }

    const venture = await Venture.findOne({ _id: ventureId, isDeleted: false });
    if (!venture) {
      return res.status(404).json({ message: "Venture not found." });
    }

    if (!venture.images.includes(imageUrl)) {
      return res.status(400).json({ message: "Image not found in venture." });
    }

    venture.images = venture.images.filter((img) => img !== imageUrl);
    await venture.save();

    try {
      const basePath = path.resolve("public");
      const fullPath = path.resolve("public", "." + imageUrl); // safer path concat

      if (!fullPath.startsWith(basePath)) {
        console.warn("Unsafe path blocked:", fullPath);
      } else {
        await fs.unlink(fullPath);
      }
    } catch (err) {
      console.warn("Failed to delete from disk:", err.message);
    }

    return res.status(200).json({
      message: "Image deleted successfully.",
      data: { images: venture.images },
    });
  } catch (err) {
    console.error("deleteVentureImage error:", err);
    return res.status(500).json({ message: "Failed to delete image." });
  }
};

export default deleteVentureImage;
