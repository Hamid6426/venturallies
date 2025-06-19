import Venture from "../../models/Venture.js";

const getVentureBySlug = async (req, res) => {
  try {
    const { slug: ventureSlug } = req.params;

    const venture = await Venture.findOne({
      slug: ventureSlug.toLowerCase(),
      isDeleted: false,
    }).populate("createdBy", "firstName lastName email");

    if (!venture) {
      return res.status(404).json({ message: "Venture not found." });
    }

    return res.status(200).json({ data: venture });
  } catch (err) {
    console.error("getVentureBySlug error:", err);
    return res.status(500).json({ message: "Failed to retrieve venture by slug." });
  }
};

export default getVentureBySlug;
