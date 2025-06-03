import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RootLayout from "./components/layouts/RootLayout";

import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
