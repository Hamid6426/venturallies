import Balance from "../../models/Balance.js";
import mongoose from "mongoose";

const getAllUsersBalanceDetails = async (req, res) => {
  const adminId = req.user?.id;
  const userRole = req.user?.role;

  if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(401).json({ error: "Unauthorized or Invalid Admin ID" });
  }

  if (userRole !== "admin") {
    return res.status(403).json({ message: "Admins only." });
  }

  const {
    search = "",
    minBalance,
    maxBalance,
    sortBy = "updatedAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {};
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  if (minBalance !== undefined) filters.balance = { $gte: Number(minBalance) };
  if (maxBalance !== undefined) {
    filters.balance = {
      ...filters.balance,
      $lte: Number(maxBalance),
    };
  }

  try {
    const regex = new RegExp(search, "i");

    const balances = await Balance.find(filters)
      .populate({
        path: "user",
        match: {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
        select: "firstName lastName email role",
      })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const filtered = balances.filter((b) => b.user);

    // Debug log
    if (filtered.length > 0) {
      console.log("Sample balance record:", filtered[0]);
    }

    res.status(200).json({
      data: filtered,
      page: Number(page),
      limit: Number(limit),
      count: filtered.length,
    });
  } catch (err) {
    console.error("getAllBalances error:", err);
    res.status(500).json({ message: "Failed to fetch balances." });
  }
};

export default getAllUsersBalanceDetails;
