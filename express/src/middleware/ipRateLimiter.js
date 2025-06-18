import rateLimit from "express-rate-limit";

/**
 * Factory function to create per-IP rate limiters
 * @param {Object} options
 * @param {number} options.windowMs - Time frame in ms (e.g. 15 * 60 * 1000 = 15 mins)
 * @param {number} options.max - Max requests per IP
 * @param {string} options.message - Message to return on rate limit exceeded
 * @returns Middleware function
 */
const createIpRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests from this IP. Please try again later.",
} = {}) =>
  rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });

/* -----------------------------------------
Preconfigured Middleware Exports
------------------------------------------ */

// Login attempts (tight)
export const loginLimiter = createIpRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

// Public contact form (moderate)
export const contactLimiter = createIpRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many contact form submissions. Please wait a while.",
});

// Ticket creation (for unauthenticated / hybrid use)
export const supportTicketLimiter = createIpRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: "Too many support tickets created. Please slow down.",
});

export default createIpRateLimiter;
