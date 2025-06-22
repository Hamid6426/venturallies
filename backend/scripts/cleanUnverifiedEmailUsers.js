const User = require("./models/User");

async function cleanUnverifiedEmailUsers() {
  try {
    const now = new Date();
    const result = await User.deleteMany({
      emailVerifiedAt: null,
      verificationTokenExpiresAt: { $lt: now },
    });
    console.log(`Cleaned up ${result.deletedCount} expired unverified users.`);
  } catch (error) {
    console.error("Cleanup error:", error);
  }
}

// Example: run every 24h
const ONE_DAY_MS = 1 * 60 * 60 * 1000;
setInterval(cleanUnverifiedEmailUsers, ONE_DAY_MS);

// Or use a proper cron package for better scheduling
