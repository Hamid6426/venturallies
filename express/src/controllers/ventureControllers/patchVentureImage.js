import Venture from "../../models/Venture.js";

const patchVentureImage = async (req, res) => {
  try {
    const { ventureId } = req.params;

    if (!req.processedFiles || req.processedFiles.length === 0) {
      return res.status(400).json({
        message: "No images were uploaded or processed.",
      });
    }

    const venture = await Venture.findById(ventureId);
    if (!venture) {
      return res.status(404).json({ message: "Venture not found." });
    }

    const existingImagesCount = venture.images.length;
    const newImagesCount = req.processedFiles.length;

    if (existingImagesCount + newImagesCount > 4) {
      return res.status(400).json({
        message: `You can only have up to 4 images. Currently: ${existingImagesCount}, Trying to add: ${newImagesCount}`,
      });
    }

    // Append new images to existing ones
    // const newImagePaths = req.processedFiles.map(
    //   (file) => `/uploads/ventures/${file.filename}`
    // );
    // venture.images.push(...newImagePaths);

    // await venture.save();

    // BETTER APPROACH
    // In patchVentureImage, instead of load+save:
    // const newPaths = req.processedFiles.map(
    //   (f) => `/uploads/ventures/${f.filename}`
    // );
    // const updated = await Venture.findByIdAndUpdate(
    //   ventureId,
    //   { $push: { images: { $each: newPaths } } },
    //   { new: true }
    // );

    // Build the new paths
    const newPaths = req.processedFiles.map(
      (f) => `/uploads/ventures/${f.filename}`
    );

    // Atomically append and return the updated doc
    const updated = await Venture.findByIdAndUpdate(
      ventureId,
      { $push: { images: { $each: newPaths } } },
      { new: true }
    );

    res.json({
      message: "Venture images updated successfully.",
      images: updated.images,
    });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ message: "Failed to upload images." });
  }
};

export default patchVentureImage;
