import Venture from "../models/Venture.js";
import slugify from "slugify";

const createVenture = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      longDescription,
      collateralDescription,
      images,
      country,
      status,
      ventureType,
      riskLevel,
      visibility,
      minInvestmentAmount,
      maxInvestmentAmount,
      targetAmount,
      expectedReturn,
      investmentPeriod,
      closingDate,
      collateralValue,
      loanToValue,
      isConvertible,
    } = req.body;

    if (
      !title ||
      !ventureType ||
      !status ||
      !targetAmount ||
      !expectedReturn ||
      !investmentPeriod ||
      !closingDate
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const slug = slugify(title, { lower: true });

    let uniqueSlug = slug;
    let count = 1;

    while (await Venture.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count++}`;
    }

    // Check for duplicate slug
    const existing = await Venture.findOne({ slug });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Venture with similar title already exists." });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const venture = await Venture.create({
      title,
      slug,
      shortDescription,
      longDescription,
      collateralDescription,
      images,
      country,
      status,
      ventureType,
      riskLevel,
      visibility,
      minInvestmentAmount,
      maxInvestmentAmount,
      targetAmount,
      expectedReturn,
      investmentPeriod,
      closingDate,
      collateralValue,
      loanToValue,
      isConvertible,
      createdBy: userId, // assuming user middleware sets req.user
    });

    return res
      .status(201)
      .json({ message: "Venture created successfully.", venture });
  } catch (error) {
    console.error("Create Venture Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default createVenture;
