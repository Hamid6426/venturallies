// /controllers/supportTicket/createEtc.js
import SupportTicket from "../../models/SupportTicket.js";

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Public or Authenticated (based on your setup)
const createTicket = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      description,
      priority = "Low",
      category = "General",
      userId,
    } = req.body;

    const newTicket = new SupportTicket({
      name,
      email,
      subject,
      description,
      priority,
      category,
      userId,
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: "Failed to create ticket", error });
  }
};

export default createTicket;
