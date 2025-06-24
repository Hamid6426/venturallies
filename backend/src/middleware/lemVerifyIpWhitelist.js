// src/middleware/lemVerifyIpWhitelist.js
export default function lemVerifyIpWhitelist(req, res, next) {
  const allowedIPs = ["34.247.111.53"]; // LEM Webhook EU IP
  const requestIP = req.ip || req.connection.remoteAddress;

  // Express may prepend "::ffff:" to IPv4 addresses
  const normalizedIP = requestIP.replace("::ffff:", "");

  if (allowedIPs.includes(normalizedIP)) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Invalid IP address" });
  }
}
