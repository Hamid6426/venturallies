import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { locationsData } from "../../data/locationsData";

const UserProfile = () => {
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
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { currentUser, isUserLoading } = useAuth();
  const [cities, setCities] = useState([]);

  // Load profile on mount
  useEffect(() => {
    if (!isUserLoading && currentUser) {
      setFormData((prev) => ({
        ...prev,
        ...currentUser,
        newPassword: "",
        confirmNewPassword: "", // fixed typo
      }));

      const selectedCountry = locationsData.find(
        (c) => c.countryName === currentUser.countryName
      );
      if (selectedCountry) {
        setCities(selectedCountry.countryCities);
      }
    }
  }, [isUserLoading, currentUser]);

  useEffect(() => {
    const selectedCountry = locationsData.find(
      (c) => c.countryName === formData.countryName
    );
    setCities(selectedCountry ? selectedCountry.countryCities : []);
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
    setError(null);
    setSuccess(false);

    if (formData.newPassword !== formData.confirmNewPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const updatePayload = { ...formData };

      // Conditionally include passwords
      if (!formData.newPassword || !formData.currentPassword) {
        delete updatePayload.currentPassword;
        delete updatePayload.newPassword;
      }

      delete updatePayload.confirmNewPassword;

      await axiosInstance.put("/profile/update", updatePayload);
      setSuccess(true);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="mx-auto">
      <h2 className="text-4xl w-full font-semibold mb-6 text-center py-20 bg-gray-100">
        Update Profile
      </h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && (
        <div className="text-green-600 text-center mb-4">
          Profile updated successfully.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 text-lg md:text-xl max-w-5xl mx-auto py-8 px-4"
      >
        {/* Personal Info */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium md:mb-0 w-full md:w-64">
            Personal Information
          </h4>
          <div className="w-full space-y-4">
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

        {/* Contact Info */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium md:mb-0 w-full md:w-64">
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
          <h4 className="text-xl font-medium md:mb-0 w-full md:w-64">
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

        {/* Change Password */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium md:mb-0 w-full md:w-64">
            Change Password
          </h4>
          <div className="w-full space-y-4">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            type="submit"
            className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-blue-700 hover:-translate-y-1"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
