import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { LoaderProvider, useLoader } from "./contexts/LoaderContext";
import Loader from "./components/Loader";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext.jsx";

// Create a wrapper component to use useLoader hook inside context
const AppWrapper = () => {
  const { loading } = useLoader();

  return (
    <>
      {loading && <Loader />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <App />
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <LoaderProvider>
          <AppWrapper />
        </LoaderProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
