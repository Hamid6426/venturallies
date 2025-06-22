import SupportTicket from '../../models/SupportTicket.js';

// @desc    Upload attachment to ticket
// @route   POST /api/tickets/:id/upload
// @access  Admin / Authorized
export const uploadAttachment = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    ticket.attachments.push(fileUrl);
    await ticket.save();

    res.status(200).json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload attachment', error });
  }
};
