import crypto from "crypto";

const generateOTP = () => {
  return parseInt(crypto.randomInt(100000, 999999));
};

export default generateOTP;