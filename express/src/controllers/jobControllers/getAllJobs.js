import Job from "../../models/Job.js";
import logger from "../../config/logger.js";

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
    logger.info("Fetched all jobs successfully");
  } catch (error) {
    logger.error("Error fetching jobs: %o", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export default getAllJobs;
