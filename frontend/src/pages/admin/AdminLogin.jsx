import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { useLoader } from "../../contexts/LoaderContext";
import { useAuth } from "../../contexts/AuthContext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { loadUserProfile } = useAuth();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login-admin", formData);
      await loadUserProfile();
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (data?.message) {
          toast.error(data.message);
        } else if (status === 401) {
          toast.error("Invalid credentials.");
        } else if (status === 403) {
          toast.error("You are not authorized.");
        } else {
          toast.error("Login failed.");
        }
      } else {
        toast.error("Something went wrong. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <h2 className="text-4xl font-semibold mb-6 text-center py-20 bg-gray-100">
        Admin Login
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 text-lg md:text-xl max-w-3xl mx-auto py-8 px-4"
      >
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium md:mb-0 w-full md:w-64">
            Login Credentials
          </h4>
          <div className="w-full space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <div className="flex justify-between items-center">
              <label className="flex items-center text-base">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-[#00b951] hover:font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            type="submit"
            className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-green-700 hover:-translate-y-1"
          >
            Login
          </button>
          <Link
            to="/register"
            className="bg-gray-800 text-white px-12 py-4 rounded hover:-translate-y-1 text-center"
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
