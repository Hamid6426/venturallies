import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 255 },
  shortDescription: { type: String },
  longDescription: { type: String },
  photoUrl: { type: String },

  country: { type: String, maxlength: 100 },
  status: {
    type: String,
    enum: ['new', 'coming-soon', 'funded', 'repaid'],
    required: true,
  },
  loanType: {
    type: String,
    enum: ['business', 'sme', 'leasing', 'realestate'],
    required: true,
  },
  targetAmount: { type: mongoose.Schema.Types.Decimal128, required: true },
  expectedReturn: { type: mongoose.Schema.Types.Decimal128, required: true },
  investmentPeriod: { type: Number, required: true },
  amountFunded: { type: mongoose.Schema.Types.Decimal128, required: true },

  dateIssued: { type: Date },
  closingDate: { type: Date, required: true },
  collateralValue: { type: mongoose.Schema.Types.Decimal128 },
  loanToValue: { type: mongoose.Schema.Types.Decimal128 },
  isConvertible: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);
