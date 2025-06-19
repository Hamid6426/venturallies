import axiosInstance from "../utils/axiosInstance";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", null);
      toast.success("Logged out.");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  return (
    <button
      className="block px-4 py-3 border-t border-gray-600 cursor-pointer w-full text-red-400 hover:text-red-600 hover:font-semibold"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
