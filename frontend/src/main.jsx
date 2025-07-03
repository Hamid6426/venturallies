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
import { BalanceProvider } from "./contexts/BalanceContext.jsx";

// Make the init function globally available
window.googleTranslateElementInit = function () {
  new window.google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
};


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
  <>
    <div id="google_translate_element" style={{ display: "none" }}></div>
    <Router>
      <AuthProvider>
        <BalanceProvider>
          <LoaderProvider>
            <AppWrapper />
          </LoaderProvider>
        </BalanceProvider>
      </AuthProvider>
    </Router>
  </>
</StrictMode>

);
