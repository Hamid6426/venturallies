import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 255 },
    shortDescription: { type: String },
    longDescription: { type: String },
    countryName: { type: String },
    status: {
      type: String,
      enum: ["new", "coming-soon", "funded", "repaid"],
      required: true,
    },
    loanType: {
      type: String,
      enum: ["business", "sme", "leasing", "realestate"],
      required: true,
    },

    schedules: [scheduleSchema],

    targetAmount: { type: Number, required: true },
    expectedReturn: { type: Number, required: true },
    investmentPeriod: { type: Number, required: true },
    amountFunded: { type: Number, required: true },

    dateIssued: { type: Date },
    closingDate: { type: Date, required: true },
    collateralValue: { type: Number },
    loanToValue: { type: mongoose.Schema.Types.Decimal128 },
    isConvertible: { type: Boolean, default: false },

    targetAmount: { type: Number, required: true },
    expectedReturn: { type: Number, required: true },
    amountFunded: { type: Number, required: true },
    collateralValue: { type: Number },
    loanToValue: { type: Number },
    principal: { type: Number },
    interest: { type: Number },
    total: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
