// controllers/venture/ventureImageDelete.js
import Venture from "../../models/Venture.js";
import fs from "fs";
import path from "path";

const deleteVentureImage = async (req, res) => {
  try {
    const { ventureId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required." });
    }

    const venture = await Venture.findById(ventureId);
    if (!venture) {
      return res.status(404).json({ message: "Venture not found." });
    }

    // Remove from DB
    venture.images = venture.images.filter((img) => img !== imageUrl);
    await venture.save();

    // Optionally remove from disk
    const fullPath = path.resolve(`./${imageUrl}`);
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Failed to delete image from disk:", err);
      });
    }

    res.status(200).json({
      message: "Image deleted successfully.",
      images: venture.images,
    });
  } catch (err) {
    console.error("ventureImageDelete error:", err);
    res.status(500).json({ message: "Failed to delete image." });
  }
};

export default deleteVentureImage;
