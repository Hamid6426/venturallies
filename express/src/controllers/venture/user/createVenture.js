import slugify from "slugify";
import Venture from "../../../models/Venture.js";

/**
 * POST /api/ventures
 * Body: Venture payload
 * Auth: Required
 */
const createVenture = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      longDescription,
      collateralDescription,
      country,
      lifecycleStatus,
      ventureType,
      riskLevel = "medium",
      visibility = "draft",
      minInvestmentAmount,
      maxInvestmentAmount,
      targetAmount,
      expectedReturn,
      investmentPeriod,
      closingDate,
      collateralValue,
      loanToValue,
      isConvertible = false,
      tags = [],
      launchDate,
      goesLiveAt,
      isFeatured = false,
      featuredUntil,
      images = [],
    } = req.body;

    // 1. Validate Required Fields
    const requiredFields = {
      title,
      lifecycleStatus,
      ventureType,
      targetAmount,
      expectedReturn,
      investmentPeriod,
      closingDate,
      shortDescription,
      longDescription,
      collateralDescription,
      country,
      minInvestmentAmount,
      maxInvestmentAmount,
      collateralValue,
      loanToValue,
    };
    const missing = Object.entries(requiredFields)
      .filter(
        ([_, value]) => value === undefined || value === null || value === ""
      )
      .map(([key]) => key);

    if (missing.length) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const existingTitle = await Venture.findOne({ title: title.trim() });
    if (existingTitle) {
      return res
        .status(409)
        .json({ message: "A venture with this title already exists." });
    }

    // 2. Validate Number Fields
    const numberFields = [
      { name: "minInvestmentAmount", value: minInvestmentAmount },
      { name: "maxInvestmentAmount", value: maxInvestmentAmount },
      { name: "targetAmount", value: targetAmount, required: true },
      { name: "expectedReturn", value: expectedReturn, required: true },
      { name: "investmentPeriod", value: investmentPeriod, required: true },
      { name: "collateralValue", value: collateralValue },
      { name: "loanToValue", value: loanToValue },
    ];

    for (const { name, value, required } of numberFields) {
      if (required && (value === undefined || isNaN(Number(value)))) {
        return res
          .status(400)
          .json({ message: `${name} is required and must be a valid number.` });
      }
      if (!required && value !== undefined && isNaN(Number(value))) {
        return res
          .status(400)
          .json({ message: `${name} must be a valid number.` });
      }
    }

    // 3. Additional Business Rules
    if (
      minInvestmentAmount &&
      maxInvestmentAmount &&
      Number(minInvestmentAmount) > Number(maxInvestmentAmount)
    ) {
      return res.status(400).json({
        message:
          "Minimum investment cannot be greater than maximum investment.",
      });
    }

    if (loanToValue && Number(loanToValue) > 100) {
      return res
        .status(400)
        .json({ message: "Loan to value cannot exceed 100%" });
    }

    const dateFields = [
      { name: "closingDate", value: closingDate, required: true },
      { name: "launchDate", value: launchDate },
      { name: "featuredUntil", value: featuredUntil },
    ];

    const isValidDate = (d) => !isNaN(new Date(d).getTime());

    for (const { name, value, required } of dateFields) {
      if (required && !isValidDate(value)) {
        return res
          .status(400)
          .json({ message: `${name} is required and must be a valid date.` });
      }
      if (!required && value && !isValidDate(value)) {
        return res
          .status(400)
          .json({ message: `${name} must be a valid date.` });
      }
    }

    // 4. Auth Check
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 5. Slug Generation
    const baseSlug = slugify(title.trim(), { lower: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Venture.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // 6. Create Venture
    const venture = await Venture.create({
      title: title.trim(),
      slug,
      shortDescription,
      longDescription,
      collateralDescription,
      country,
      lifecycleStatus,
      ventureType,
      riskLevel,
      visibility,
      minInvestmentAmount: Number(minInvestmentAmount),
      maxInvestmentAmount: Number(maxInvestmentAmount),
      targetAmount: Number(targetAmount),
      expectedReturn: Number(expectedReturn),
      investmentPeriod: Number(investmentPeriod),
      closingDate: new Date(closingDate),
      collateralValue: collateralValue ? Number(collateralValue) : 0,
      loanToValue: Number(loanToValue) || 0,
      isConvertible: Boolean(isConvertible),
      tags: tags.map((tag) => tag.toLowerCase().trim()).slice(0, 10),
      images: Array.isArray(images) ? images : [],
      launchDate: launchDate ? new Date(launchDate) : null,
      goesLiveAt: goesLiveAt ? new Date(goesLiveAt) : null,
      isFeatured,
      featuredUntil: featuredUntil ? new Date(featuredUntil) : null,
      createdBy: userId,
    });

    return res
      .status(201)
      .json({ message: "Venture created successfully.", venture });
  } catch (err) {
    console.error("Create Venture Error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default createVenture;
