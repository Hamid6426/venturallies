import { useState, useEffect } from "react";
import { cityData } from "../data/cityData";

const Register = () => {
  const [formData, setFormData] = useState({
    user_fname: "",
    user_lname: "",
    user_email: "",
    user_phone: "",
    user_country: "",
    user_city: "",
    user_address: "",
    user_newsletter_freq: "monthly",
    user_notify_funding: false,
    user_latest_news: false,
    user_password: "",
    user_cpassword: "",
  });

  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (formData.user_country && cityData[formData.user_country]) {
      setCities(cityData[formData.user_country]);
    } else {
      setCities([]);
    }
  }, [formData.user_country]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.user_password !== formData.user_cpassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      setError("Invalid email address.");
      return;
    }

    // TODO: Submit to backend
    console.log("Submitted:", formData);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Create Account</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-">
        {/* Personal Information */}
        <section className="flex flex-col md:flex-row gap-12">
          <h4 className="text-xl font-medium mb-2">Personal Information</h4>
          <div>
            <input
              type="text"
              name="user_fname"
              placeholder="First Name"
              value={formData.user_fname}
              onChange={handleChange}
              required
              className="border-b-2 p-2 rounded w-full focus:ring-2 focus:ring-red-400"
            />
            <input
              type="text"
              name="user_lname"
              placeholder="Last Name"
              value={formData.user_lname}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h4 className="text-xl font-medium mb-2">Contact Information</h4>
          <div>
            <input
              type="email"
              name="user_email"
              placeholder="Email"
              value={formData.user_email}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="tel"
              name="user_phone"
              placeholder="Phone"
              value={formData.user_phone}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <select
              name="user_country"
              value={formData.user_country}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select a country</option>
              <option value="at">Austria</option>
              <option value="be">Belgium</option>
              <option value="bg">Bulgaria</option>
              <option value="hr">Croatia</option>
              <option value="cy">Cyprus</option>
              <option value="cz">Czech Republic</option>
              <option value="dk">Denmark</option>
              <option value="ee">Estonia</option>
              <option value="fi">Finland</option>
              <option value="fr">France</option>
              <option value="de">Germany</option>
              <option value="gr">Greece</option>
              <option value="hu">Hungary</option>
              <option value="ie">Ireland</option>
              <option value="it">Italy</option>
              <option value="lv">Latvia</option>
              <option value="lt">Lithuania</option>
              <option value="lu">Luxembourg</option>
              <option value="mt">Malta</option>
              <option value="nl">Netherlands</option>
              <option value="pl">Poland</option>
              <option value="pt">Portugal</option>
              <option value="ro">Romania</option>
              <option value="sk">Slovakia</option>
              <option value="si">Slovenia</option>
              <option value="es">Spain</option>
              <option value="se">Sweden</option>
              <option value="gb">United Kingdom</option>
            </select>
            <select
              name="user_city"
              value={formData.user_city}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
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
              name="user_address"
              placeholder="Address"
              value={formData.user_address}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
        </section>

        {/* Other Information */}
        <section>
          <h4 className="text-xl font-medium mb-2">Preferences</h4>
          <select
            name="user_newsletter_freq"
            value={formData.user_newsletter_freq}
            onChange={handleChange}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="never">Never</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="user_notify_funding"
                checked={formData.user_notify_funding}
                onChange={handleChange}
                className="mr-2"
              />
              Notify me about deposits / withdrawals
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="user_latest_news"
                checked={formData.user_latest_news}
                onChange={handleChange}
                className="mr-2"
              />
              I want to get the latest news
            </label>
          </div>
        </section>

        {/* Password */}
        <section>
          <h4 className="text-xl font-medium mb-2">Password</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="password"
              name="user_password"
              placeholder="Password"
              value={formData.user_password}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              name="user_cpassword"
              placeholder="Confirm Password"
              value={formData.user_cpassword}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Account & Verify Identity
          </button>
          <a
            href="/login"
            className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
          >
            OR Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;
