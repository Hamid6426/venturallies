const logoutUser = (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("authToken", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default logoutUser;
