// controllers/repayment/getMyReturns.js
import Repayment from "../../models/Repayment.js";
import Investment from "../../models/Investment.js";
import Venture from "../../models/Venture.js";

const getMyReturns = async (req, res) => {
  try {
    const repayments = await Repayment.find({
      user: req.user._id,
      type: "profit",
      status: "paid",
    })
      .populate({
        path: "investment",
        populate: { path: "venture", select: "title slug" },
      })
      .sort({ date: -1 });

    return res.status(200).json(repayments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default getMyReturns;
