// PUT /api/ventures/:id/feature

export const setVentureFeatured = async (req, res) => {
  const { isFeatured, featuredUntil } = req.body;
  const { id } = req.params;

  try {
    const venture = await Venture.findByIdAndUpdate(id, {
      isFeatured,
      featuredUntil: isFeatured ? featuredUntil : null,
    }, { new: true });

    res.json(venture);
  } catch (error) {
    res.status(500).json({ message: "Failed to update feature status" });
  }
};
