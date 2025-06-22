import Investment from "../../models/Investment.js";

// DELETE /api/investments/:id
const cancelInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment || investment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized or not found" });
    }

    if (investment.status !== "pending") {
      return res.status(400).json({ message: "Only pending investments can be cancelled" });
    }

    investment.status = "cancelled";
    investment.updatedBy = req.user._id;
    await investment.save();

    return res.status(200).json({ message: "Investment cancelled", investment });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default cancelInvestment;