import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { locationsData } from "../../utils/locationsData.js";
import { toTitleCase } from "../../helpers/toTitleCase.js";

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
    // Handle optional password update
    // ────────────────────────────────────────
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Both current and new passwords are required" });
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
    // Country/City validation & normalization
    // ────────────────────────────────────────
    if (country) {
      const countryObj = locationsData.find(
        (c) => c.country.toLowerCase() === country.toLowerCase()
      );

      if (!countryObj) {
        return res.status(400).json({ message: "Invalid country" });
      }

      if (city && !countryObj.countryCities.includes(city)) {
        return res
          .status(400)
          .json({ message: "Invalid city for the selected country" });
      }

      user.country = toTitleCase(countryObj.country);
      user.countryCode = countryObj.countryCode.toUpperCase();
    }

    if (city) {
      user.city = toTitleCase(city);
    }

    // ────────────────────────────────────────
    // Update other profile fields
    // ────────────────────────────────────────
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.newsletterFrequency = newsletterFrequency ?? user.newsletterFrequency;
    user.transactionNotification =
      transactionNotification ?? user.transactionNotification;
    user.latestNewsNotification =
      latestNewsNotification ?? user.latestNewsNotification;
    user.preferences = preferences ?? user.preferences;

    await user.save();

    // ────────────────────────────────────────
    // Return updated user profile
    // ────────────────────────────────────────
    const {
      firstName: updatedFirstName,
      lastName: updatedLastName,
      email,
      phone: updatedPhone,
      country: updatedCountry,
      countryCode,
      city: updatedCity,
      address: updatedAddress,
      newsletterFrequency: updatedNewsletterFrequency,
      transactionNotification: updatedTransactionNotification,
      latestNewsNotification: updatedLatestNewsNotification,
      preferences: updatedPreferences,
      avatarUrl,
      role,
    } = user;

    res.status(200).json({
      firstName: updatedFirstName,
      lastName: updatedLastName,
      email,
      phone: updatedPhone,
      country: updatedCountry,
      countryCode,
      city: updatedCity,
      address: updatedAddress,
      newsletterFrequency: updatedNewsletterFrequency,
      transactionNotification: updatedTransactionNotification,
      latestNewsNotification: updatedLatestNewsNotification,
      preferences: updatedPreferences,
      avatarUrl,
      role,
    });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default updateProfile;
