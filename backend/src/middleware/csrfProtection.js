// middleware/csrfProtection.js
import csrf from "csurf";

// Use cookie-based tokens
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // ""
  },
});

export default csrfProtection;
