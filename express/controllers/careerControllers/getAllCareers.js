import Career from "../../models/Careers.js";
import logger from "../../config/logger.js";

const getAllCareers = async (req, res) => {
  try {
    const careers = await Career.findAll();
    res.json(careers);
    logger.info("Fetched all careers successfully");
  } catch (error) {
    logger.error("Error fetching careers: %o", error);
    res.status(500).json({ error: "Failed to fetch careers" });
  }
};

export default getAllCareers;
