import generateOTP from "../../helpers/generateOTP.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import sendMail from "../../utils/sendMail.js";
import { isValidEmail } from "../../helpers/validationHelpers.js";
import { locationsData } from "../../utils/locationsData.js";
import { toTitleCase } from "../../helpers/toTitleCase.js";

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      countryName,
      city,
      address,
      newsletterFrequency,
      transactionNotification,
      latestNewsNotification,
      password,
    } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (
      newsletterFrequency &&
      !["never", "daily", "weekly", "monthly", "yearly"].includes(
        newsletterFrequency
      )
    ) {
      return res.status(400).json({ message: "Invalid newsletter frequency." });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Parse salt rounds properly
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 12;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token & expiry (1 hour)
    const emailVerificationToken = generateOTP();
    const emailVerificationTokenExpiresAt = new Date(Date.now() + 3600 * 1000);

    const normalizedEmail = email.toLowerCase();

    // Match by full country name
    const countryObj = locationsData.find(
      (c) => c.countryName.toLowerCase() === countryName.toLowerCase()
    );

    if (!countryObj) {
      return res.status(400).json({ message: "Invalid country" });
    }

    if (!countryObj.countryCities.includes(city)) {
      return res
        .status(400)
        .json({ message: "Invalid city for the selected country" });
    }

    const capitalizedCountryCode = countryObj.countryCode.toUpperCase();
    const normalizedCountryName = toTitleCase(countryObj.countryName);
    const normalizedCity = toTitleCase(city);

    // Create user object
    const user = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      countryName: normalizedCountryName,
      countryCode: capitalizedCountryCode,
      city: normalizedCity,
      address,
      newsletterFrequency: newsletterFrequency || "weekly",
      transactionNotification: transactionNotification ?? true,
      latestNewsNotification: latestNewsNotification ?? true,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationTokenExpiresAt,
    });

    // Save user
    await user.save();

    const emailVerificationUrl = `${
      process.env.FRONTEND_BASE_URL
    }/verify-email?email=${encodeURIComponent(normalizedEmail)}`;

    const subject = "Please verify your email address";
    const html = `
        <p>Hello ${firstName || "User"},</p>
        <p>Thank you for registering.</p>
        <p>Your verification code is: <strong>${emailVerificationToken}</strong></p>
        <p>Please verify your email by clicking the link below and entering the OTP:</p>
        <a href="${emailVerificationUrl}">Verify Email</a>
        <p><span>Warning</span>This link expires in 1 hour.</p>
      `;

    await sendMail({ to: normalizedEmail, subject, html });

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default registerUser;
