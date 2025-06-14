import { useState, useEffect } from "react";
import { locationsData } from "../../data/locationsData";
import { useLoader } from "../../contexts/LoaderContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryName: "",
    city: "",
    address: "",
    newsletterFrequency: "monthly",
    transactionNotification: false,
    latestNewsNotification: false,
    password: "",
    confirmPassword: "",
  });

  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  useEffect(() => {
    const selectedCountry = locationsData.find(
      (c) => c.countryName.toLowerCase() === formData.countryName.toLowerCase()
    );
    if (selectedCountry) {
      setCities(selectedCountry.countryCities);
      setFormData((prev) => ({ ...prev, city: "" }));
    } else {
      setCities([]);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.countryName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error("Password should be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email address.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = { ...formData };
    Object.keys(payload).forEach(
      (key) =>
        typeof payload[key] === "string" && (payload[key] = payload[key].trim())
    );
    delete payload.confirmPassword;

    try {
      await axiosInstance.post("/api/auth/register", payload);

      toast.success("Registration successful! Please verify your email.");
      navigate(`/verify-email?email=${formData.email}`);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        toast.error(error.response.data.message || "Registration failed.");
      } else if (error.request) {
        // request made but no response received
        console.error("Request error:", error.request);
        toast.error("No response from server. Please try again later.");
      } else {
        // something else happened
        console.error("Error message:", error.message);
        toast.error("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <h2 className="text-4xl w-full font-semibold mb-6 text-center py-20 bg-gray-100">
        Create Account
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 text-lg md:text-xl max-w-5xl mx-auto py-8 px-4"
      >
        {/* Personal Information */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium md:mb-0 w-full md:w-64">
            Personal Information
          </h4>
          <div className="w-full space-y-4 ">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* Contact Information */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium mb-2 md:mb-0 w-full md:w-64">
            Contact Information
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
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <select
              name="countryName"
              value={formData.countryName}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            >
              <option value="">Select a country</option>
              {locationsData.map(({ countryName }) => (
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              ))}
            </select>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* Preferences */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium mb-2 md:mb-0 w-full md:w-64">
            Preferences
          </h4>
          <div className="w-full space-y-4">
            <select
              name="newsletterFrequency"
              value={formData.newsletterFrequency}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="never">Never</option>
            </select>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="transactionNotification"
                checked={formData.transactionNotification}
                onChange={handleChange}
                className="mr-2"
              />
              Notify me about deposits / withdrawals
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="latestNewsNotification"
                checked={formData.latestNewsNotification}
                onChange={handleChange}
                className="mr-2"
              />
              I want to get the latest news
            </label>
          </div>
        </section>

        {/* Password */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium mb-2 md:mb-0 w-full md:w-64">
            Password
          </h4>
          <div className="w-full space-y-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col md:flex-row gap-4 mt-">
          <button
            type="submit"
            className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-blue-700 hover:-translate-y-1"
          >
            Create Account & Verify Account
          </button>
          <a
            href="/login"
            className="bg-gray-800 text-white px-12 py-4 rounded hover:-translate-y-1 text-center"
          >
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;
