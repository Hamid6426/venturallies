// PUT /api/ventures/:id/tags

export const updateVentureTags = async (req, res) => {
  const { tags } = req.body;
  const { id } = req.params;

  if (!Array.isArray(tags)) {
    return res.status(400).json({ message: "Tags must be an array" });
  }

  try {
    const venture = await Venture.findByIdAndUpdate(id, {
      tags,
    }, { new: true });

    res.json(venture);
  } catch (err) {
    res.status(500).json({ message: "Failed to update tags" });
  }
};
