import Investment from "../../models/Investment.js"

// PATCH /api/admin/investments/:investmentId/repayments/:index
const markRepaymentAsPaid = async (req, res) => {
  try {
    const { investmentId, index } = req.params;

    const investment = await Investment.findById(investmentId);
    if (!investment) return res.status(404).json({ message: "Investment not found" });

    const repayment = investment.repayments[index];
    if (!repayment) return res.status(400).json({ message: "Repayment entry not found" });

    if (repayment.status === "paid") {
      return res.status(400).json({ message: "Repayment already marked as paid" });
    }

    repayment.status = "paid";
    // Optionally: repayment.paidAt = new Date();

    investment.updatedBy = req.user._id;
    await investment.save();

    return res.status(200).json({ message: "Repayment marked as paid", repayment });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default markRepaymentAsPaid;