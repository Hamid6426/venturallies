import Venture from "../../models/Venture.js";
import {
  validateRequiredFields,
  validateNumberFields,
  validateDateFields,
  generateUniqueSlug,
  validateEnumFields,
} from "../../utils/ventureValidation.js";

const createVenture = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      title,
      shortDescription,
      longDescription,
      collateralDescription,
      country,
      ventureType,
      riskLevel = "medium",
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
      images = [],
      schedules = [],
      history = [],
    } = req.body;

    // 1. Required Field Check (excluding lifecycleStatus, visibility, dateIssued)
    const missing = validateRequiredFields({
      title,
      shortDescription,
      longDescription,
      collateralDescription,
      country,
      ventureType,
      minInvestmentAmount,
      maxInvestmentAmount,
      targetAmount,
      expectedReturn,
      investmentPeriod,
      closingDate,
      collateralValue,
      loanToValue,
    });
    if (missing.length) {
      return res.status(400).json({ message: `Missing: ${missing.join(", ")}` });
    }

    // 2. Format Validations
    const validationErrors = [
      ...validateNumberFields([
        { name: "minInvestmentAmount", value: minInvestmentAmount },
        { name: "maxInvestmentAmount", value: maxInvestmentAmount },
        { name: "targetAmount", value: targetAmount },
        { name: "expectedReturn", value: expectedReturn },
        { name: "investmentPeriod", value: investmentPeriod },
        { name: "collateralValue", value: collateralValue },
        { name: "loanToValue", value: loanToValue },
      ]),
      ...validateDateFields([
        { name: "closingDate", value: closingDate },
      ]),
      ...validateEnumFields([
        {
          name: "ventureType",
          value: ventureType,
          allowedValues: ["business", "sme", "leasing", "realestate"],
        },
        {
          name: "riskLevel",
          value: riskLevel,
          allowedValues: ["low", "medium", "high"],
        },
      ]),
    ];
    if (validationErrors.length) {
      return res.status(400).json({ message: validationErrors.join(" ") });
    }

    // 3. Business Rules
    if (+minInvestmentAmount > +maxInvestmentAmount)
      return res.status(400).json({ message: "Min investment > Max investment" });

    if (+loanToValue > 100)
      return res.status(400).json({ message: "Loan-to-value cannot exceed 100%" });

    // 4. Title Uniqueness
    const existing = await Venture.findOne({ title: title.trim() });
    if (existing)
      return res.status(409).json({ message: "Title already exists." });

    // 5. Venture Creation
    const slug = await generateUniqueSlug(title.trim());

    const venture = await Venture.create({
      title: title.trim(),
      slug,
      shortDescription,
      longDescription,
      collateralDescription,
      country,
      lifecycleStatus: "coming-soon", // hardcoded
      ventureType,
      riskLevel,
      visibility: "draft", // hardcoded
      minInvestmentAmount: +minInvestmentAmount,
      maxInvestmentAmount: +maxInvestmentAmount,
      targetAmount: +targetAmount,
      expectedReturn: +expectedReturn,
      investmentPeriod: +investmentPeriod,
      dateIssued: null, // will be set on approval
      closingDate: new Date(closingDate),
      collateralValue: +collateralValue,
      loanToValue: +loanToValue,
      isConvertible: !!isConvertible,
      tags: tags.map(t => t.toLowerCase().trim()).slice(0, 10),
      images: Array.isArray(images) ? images : [],
      schedules: Array.isArray(schedules) ? schedules : [],
      history: Array.isArray(history) ? history : [],
      createdBy: userId,
      adminStatus: "pending",
      adminNote: null,
      adminReviewedAt: null,
      goesLiveAt: null,
      amountFunded: 0,
      principal: null,
      interest: null,
      total: null,
      isDeleted: false,
    });

    return res.status(201).json({ message: "Venture created", venture });
  } catch (err) {
    console.error("Create Venture Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default createVenture;
