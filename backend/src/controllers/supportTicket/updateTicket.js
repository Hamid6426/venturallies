import SupportTicket from '../../models/SupportTicket.js';
import path from 'path';
import fs from 'fs';

// Already defined: createTicket, getAllTickets, getTicketById

// @desc    Update support ticket
// @route   PATCH /api/tickets/:id
// @access  Admin or Authorized user
export const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const updates = req.body;

    const ticket = await SupportTicket.findByIdAndUpdate(ticketId, updates, {
      new: true,
      runValidators: true
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update ticket', error });
  }
};
