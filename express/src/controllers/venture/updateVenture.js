import Venture from "../../models/Venture.js";

const updateVenture = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Disallow updating immutable/system fields here
    const forbidden = ['_id', 'createdBy', 'createdAt', 'slug', 'amountFunded', 'isDeleted'];
    forbidden.forEach(field => delete updates[field]);

    const venture = await Venture.findById(id);
    if (!venture) {
      return res.status(404).json({ error: "Venture not found." });
    }

    // Apply updates to the venture
    Object.assign(venture, updates, { updatedBy: req.user?._id });
    await venture.save();

    return res.status(200).json({ message: "Venture updated.", venture });
  } catch (err) {
    console.error("updateVenture error:", err);
    return res.status(500).json({ error: "Failed to update venture." });
  }
};

export default updateVenture;