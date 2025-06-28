  import { useEffect, useState } from "react";
  import axiosInstance from "../../utils/axiosInstance";
  import { toast } from "react-toastify";
  import { FaCheckCircle, FaUserShield } from "react-icons/fa";

  export default function UserKYCCard() {
    const [status, setStatus] = useState("loading"); // loading, pending, complete
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchStatus = async () => {
        try {
          const res = await axiosInstance.get("/kyc/my-verification");
          setStatus(res.data.statusInOurSystem || "pending");
        } catch {
          toast.error("Could not check verification status");
          setStatus("pending");
        }
      };
      fetchStatus();
    }, []);

    const startVerif = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.post("/kyc/start-verification");
        const url = res.data.verificationUrl;
        if (url) {
          toast.success("Verification link generated!");
          window.open(url, "_blank");
        } else toast.error("No URL returned.");
      } catch (e) {
        toast.error(e.response?.data?.message || "Error starting verification.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "loading") {
      return <p className="text-center mt-4">Checking status...</p>;
    }

    return (
      <div className="max-w-sm mx-auto my-12 w-full bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
        {status === "complete" ? (
          <>
            <FaCheckCircle size={48} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Verified & Ready!</h2>
            <p className="text-gray-600">
              You’re fully verified and can now invest freely.
            </p>
          </>
        ) : (
          <>
            <FaUserShield size={48} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Verify Your Identity</h2>
            <p className="text-gray-600 mb-4">
              Please complete a quick identity check to start investing.
            </p>
            <button
              onClick={startVerif}
              disabled={loading}
              className="mt-2 bg-green-500 hover:-translate-y-1 text-white font-bold py-2 px-6 rounded disabled:opacity-50 transition"
            >
              {loading ? "Starting..." : "Start Verification"}
            </button>
          </>
        )}
      </div>
    );
  }
