import Venture from "../../models/Venture.js";

const getVentureBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const venture = await Venture.findOne({
      slug: slug.toLowerCase(),
    }).populate("createdBy", "firstName lastName email");

    if (!venture) {
      return res.status(404).json({ error: "Venture not found" });
    }

    res.status(200).json(venture);
  } catch (err) {
    console.error("getVentureBySlug error:", err);
    res.status(500).json({ error: "Failed to retrieve venture by slug." });
  }
};

export default getVentureBySlug;
