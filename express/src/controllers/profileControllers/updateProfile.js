import bcrypt from "bcrypt";
import User from "../../models/User.js";

const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      firstName,
      lastName,
      phone,
      country,
      city,
      address,
      newsletterFrequency,
      transactionNotification,
      latestNewsNotification,
      preferences,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ────────────────────────────────────────
    // Optional: Update password securely
    // ────────────────────────────────────────
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Both old and new passwords are required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
    }

    // ────────────────────────────────────────
    // Update profile fields
    // ────────────────────────────────────────
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.phone = phone ?? user.phone;
    user.country = country ?? user.country;
    user.city = city ?? user.city;
    user.address = address ?? user.address;
    user.newsletterFrequency = newsletterFrequency ?? user.newsletterFrequency;
    user.transactionNotification =
      transactionNotification ?? user.transactionNotification;
    user.latestNewsNotification =
      latestNewsNotification ?? user.latestNewsNotification;
    user.preferences = preferences ?? user.preferences;

    await user.save();

    const {
      firstName: fn,
      lastName: ln,
      email,
      phone: ph,
      country: c,
      city: ct,
      address: addr,
      newsletterFrequency: nf,
      transactionNotification: tn,
      latestNewsNotification: lnn,
      preferences: pref,
      avatarUrl,
      role,
    } = user;

    res.status(200).json({
      firstName: fn,
      lastName: ln,
      email,
      phone: ph,
      country: c,
      city: ct,
      address: addr,
      newsletterFrequency: nf,
      transactionNotification: tn,
      latestNewsNotification: lnn,
      preferences: pref,
      avatarUrl,
      role,
    });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default updateProfile;
