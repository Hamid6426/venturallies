// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// export default function ProjectInvest() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();

//   const [venture, setVenture] = useState(null);
//   const [amount, setAmount] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     const fetchVenture = async () => {
//       try {
//         const res = await axiosInstance.get(`/ventures/${projectId}`);
//         setVenture(res.data);
//       } catch (err) {
//         setError("Failed to load venture details");
//       }
//     };

//     fetchVenture();
//   }, [projectId]);

//   const handleInvest = async () => {
//     setError("");
//     setSuccess(false);

//     const parsedAmount = parseFloat(amount);
//     if (isNaN(parsedAmount) || parsedAmount <= 0)
//       return setError("Please enter a valid investment amount");

//     if (parsedAmount < venture.minInvestmentAmount)
//       return setError(`Minimum investment is €${venture.minInvestmentAmount}`);

//     setLoading(true);
//     try {
//       await axiosInstance.post("/investments", {
//         ventureId: venture._id,
//         amount: parsedAmount,
//       });

//       setSuccess(true);
//       setAmount("");
//       setTimeout(() => navigate("/my-investments"), 1500); // redirect after 1.5s
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Investment failed, please try again"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!venture) return <p className="text-center py-10">Loading...</p>;

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-16">
//       <h2 className="text-2xl font-bold mb-6">
//         Invest in {venture.title}
//       </h2>

//       <div className="mb-4">
//         <p className="text-gray-700">{venture.shortDescription}</p>
//         <p className="mt-2 text-sm text-gray-500">
//           Expected Return: <strong>{venture.expectedReturn}%</strong> over{" "}
//           <strong>{venture.investmentPeriod} months</strong>
//         </p>
//         <p className="text-sm text-gray-500">
//           Minimum Investment: €{venture.minInvestmentAmount}
//         </p>
//       </div>

//       <div className="mb-6">
//         <label className="block mb-2 font-semibold">Investment Amount (€)</label>
//         <input
//           type="number"
//           min={venture.minInvestmentAmount}
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
//         />
//       </div>

//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {success && (
//         <p className="text-green-600 mb-4">
//           Investment successful! Redirecting...
//         </p>
//       )}

//       <button
//         onClick={handleInvest}
//         disabled={loading}
//         className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
//       >
//         {loading ? "Investing..." : "Confirm Investment"}
//       </button>
//     </div>
//   );
// }

export default function InvestmentForm() {
  return (
    <div>
      
    </div>
  )
}
