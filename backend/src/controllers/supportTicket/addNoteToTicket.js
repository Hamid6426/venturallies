import SupportTicket from "../../models/SupportTicket.js";

// @desc    Add a note to ticket
// @route   POST /api/tickets/:id/notes
// @access  Admin / Authorized
export const addNoteToTicket = async (req, res) => {
  try {
    const { note } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.notes.push(note);
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Failed to add note", error });
  }
};
