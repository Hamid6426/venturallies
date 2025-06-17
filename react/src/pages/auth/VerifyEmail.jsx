import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle"); // idle | verifying | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || !email) {
      toast.error("Email and OTP are required.");
      setStatus("error");
      return;
    }

    try {
      setStatus("verifying");

      const response = await axiosInstance.post("/api/auth/verify-email", {
        email,
        token: otp,
      });

      setStatus("success");
      toast.success(response.data.message || "Email verified successfully.");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Email verification failed.";
      toast.error(errorMessage);
      setStatus("error");
    }
  };

  const handleResend = async () => {
    try {
      if (!email) {
        toast.error("Missing email address.");
        return;
      }

      await axiosInstance.post("/auth/resend-verification-token", { email });
      toast.success("Verification email resent.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend verification email."
      );
    }
  };

  return (
    <div className="mx-auto">
      <h2 className="text-4xl w-full font-semibold mb-6 text-center py-20 bg-gray-100">
        Verify Email
      </h2>

      <form
        onSubmit={handleSubmit}
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

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-green-700 hover:-translate-y-1 disabled:opacity-50"
            disabled={status === "verifying"}
          >
            {status === "verifying" ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="bg-gray-800 text-white px-12 py-4 rounded hover:bg-gray-700 hover:-translate-y-1"
          >
            Resend OTP
          </button>
        </div>

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
