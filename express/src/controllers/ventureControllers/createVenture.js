import slugify from "slugify";
import Venture from "../../models/Venture.js";

const createVenture = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      longDescription,
      collateralDescription,
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

    // Check for required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!ventureType) missingFields.push("ventureType");
    if (!status) missingFields.push("status");
    if (!targetAmount) missingFields.push("targetAmount");
    if (!expectedReturn) missingFields.push("expectedReturn");
    if (!investmentPeriod) missingFields.push("investmentPeriod");
    if (!closingDate) missingFields.push("closingDate");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}.`,
      });
    }

    // Type and value validation
    const numericValidations = [
      { field: "targetAmount", value: targetAmount },
      { field: "expectedReturn", value: expectedReturn },
      { field: "investmentPeriod", value: investmentPeriod },
    ];

    for (const { field, value } of numericValidations) {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        return res.status(400).json({
          message: `${field} must be a positive number.`,
        });
      }
    }

    if (isNaN(Date.parse(closingDate))) {
      return res
        .status(400)
        .json({ message: "closingDate must be a valid date." });
    }

    // Optional number fields
    const optionalNumbers = [
      { field: "minInvestmentAmount", value: minInvestmentAmount },
      { field: "maxInvestmentAmount", value: maxInvestmentAmount },
      { field: "collateralValue", value: collateralValue },
      { field: "loanToValue", value: loanToValue },
    ];

    for (const { field, value } of optionalNumbers) {
      if (value !== undefined && value !== "" && isNaN(Number(value))) {
        return res.status(400).json({
          message: `${field} must be a valid number.`,
        });
      }
    }

    // Ensure user is authenticated
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Generate a unique slug from title
    const baseSlug = slugify(title, { lower: true });
    let uniqueSlug = baseSlug;
    let count = 1;

    while (await Venture.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    // Create venture
    const venture = await Venture.create({
      title,
      slug: uniqueSlug,
      shortDescription,
      longDescription,
      collateralDescription,
      country,
      status,
      ventureType,
      riskLevel,
      visibility,
      minInvestmentAmount: minInvestmentAmount
        ? Number(minInvestmentAmount)
        : undefined,
      maxInvestmentAmount: maxInvestmentAmount
        ? Number(maxInvestmentAmount)
        : undefined,
      targetAmount: Number(targetAmount),
      expectedReturn: Number(expectedReturn),
      investmentPeriod: Number(investmentPeriod),
      closingDate: new Date(closingDate),
      collateralValue: collateralValue ? Number(collateralValue) : undefined,
      loanToValue: loanToValue ? Number(loanToValue) : undefined,
      isConvertible: !!isConvertible,
      createdBy: userId,
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
