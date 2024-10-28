// >>rafce<< react arrow function component export.

import React from "react";
import AppRoutes from "./routes/AppRoutes";

// import react-toastify for alart and handle error
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  );
};

export default App;
