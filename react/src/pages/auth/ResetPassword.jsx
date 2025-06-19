import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) {
      toast.error("Invalid reset link.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!otp || !email) {
      const msg = "Email and OTP are required.";
      toast.error(msg);
      setStatus("error");
      setMessage(msg);
      return;
    }

    if (password !== confirm) {
      const msg = "Passwords do not match.";
      toast.error(msg);
      setMessage(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      toast.error(msg);
      setMessage(msg);
      return;
    }

    try {
      setStatus("processing");
      setMessage(""); // clear previous messages

      const response = await axiosInstance.post("/auth/reset-password", {
        email,
        token: otp,
        newPassword: password,
      });

      const msg = response.data.message || "Password reset successful.";
      toast.success(msg);
      setStatus("success");
      setMessage(msg);

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed.";
      toast.error(msg);
      setStatus("error");
      setMessage(msg);
    }
  };

  return (
    <div className="mx-auto">
      <h2 className="text-4xl w-full font-semibold mb-6 text-center py-20 bg-gray-100">
        Reset Password
      </h2>

      <form
        onSubmit={handleReset}
        className="space-y-8 text-lg md:text-xl max-w-3xl mx-auto py-24 px-4"
      >
        {/* OTP Input */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium mb-2 md:mb-0 w-full md:w-64">
            Enter OTP
          </h4>
          <div className="w-full">
            <input
              type="text"
              name="otp"
              placeholder="Enter the code sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* New Password */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium mb-2 md:mb-0 w-full md:w-64">
            New Password
          </h4>
          <div className="w-full">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* Confirm Password */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium mb-2 md:mb-0 w-full md:w-64">
            Confirm Password
          </h4>
          <div className="w-full">
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-green-700 hover:-translate-y-1 disabled:opacity-50"
          disabled={status === "processing"}
        >
          {status === "processing" ? "Resetting..." : "Reset Password"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-sm mt-4 ${
              status === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
