// PUT /api/ventures/:id/schedule

export const scheduleVenture = async (req, res) => {
  const { launchDate, goesLiveAt } = req.body;
  const { id } = req.params;

  try {
    const venture = await Venture.findByIdAndUpdate(id, {
      launchDate,
      goesLiveAt,
    }, { new: true });

    res.json(venture);
  } catch (err) {
    res.status(500).json({ message: "Failed to schedule venture" });
  }
};
