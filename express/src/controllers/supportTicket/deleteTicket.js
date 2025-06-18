import SupportTicket from '../../models/SupportTicket.js';
import path from 'path';
import fs from 'fs';

// @desc    Delete a support ticket
// @route   DELETE /api/tickets/:id
// @access  Admin
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete ticket', error });
  }
};