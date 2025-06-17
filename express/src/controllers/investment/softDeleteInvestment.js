import Investment from "../../models/Investment.js";

// DELETE /api/admin/investments/:id
const softDeleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment)
      return res.status(404).json({ message: "Investment not found" });

    investment.isDeleted = true;
    investment.updatedBy = req.user._id;
    await investment.save();

    return res.status(200).json({ message: "Investment soft-deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default softDeleteInvestment;
