import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      setStatus("error");
      return;
    }

    try {
      setStatus("sending");
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Reset link sent. Check your email.");
      setStatus("success");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email.");
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto">
      <h2 className="text-4xl w-full font-semibold mb-6 text-center py-20 bg-gray-100">
        Forgot Password
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 text-lg md:text-xl max-w-3xl mx-auto py-24 px-4"
      >
        {/* Email Input */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium mb-2 md:mb-0 w-full md:w-64">
            Registered Email
          </h4>
          <div className="w-full">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* Submit Button */}

        <div className="flex flex-col md:flex-row gap-4 mt-">
          <button
            type="submit"
            className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-green-700 hover:-translate-y-1 disabled:opacity-50"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send Reset Link"}
          </button>
          <Link
            to="/login"
            className="bg-gray-800 text-white px-12 py-4 rounded hover:-translate-y-1 text-center"
          >
            Login
          </Link>
        </div>

        {/* Optional Message */}
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
