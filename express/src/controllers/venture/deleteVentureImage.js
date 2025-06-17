import Venture from "../../models/Venture.js";
import fs from "fs/promises";
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

    // Remove image reference from DB
    venture.images = venture.images.filter((img) => img !== imageUrl);
    await venture.save();

    // Always delete from disk safely
    try {
      const uploadsDir = path.resolve("public/uploads");
      const fullPath = path.resolve(imageUrl);

      if (!fullPath.startsWith(uploadsDir)) {
        console.warn("Skipped deletion: unsafe path", fullPath);
      } else {
        await fs.unlink(fullPath);
      }
    } catch (err) {
      console.warn("Disk deletion failed or file missing:", err.message);
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
