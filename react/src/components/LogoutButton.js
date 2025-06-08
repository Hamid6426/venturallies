const handleLogout = async () => {
  try {
    await axiosInstance.post("/auth/logout", null, { withCredentials: true });
    toast.success("Logged out.");
    navigate("/login");
  } catch (err) {
    toast.error("Logout failed.");
  }
};

<button onClick={handleLogout}>Logout</button>;
