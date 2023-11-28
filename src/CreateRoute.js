// CreateRoute.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import ButtonSelectionWithJsonDataAndModal from "./ButtonSelectionWithJsonDataAndModal";

const CreateRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/select-resume"
        element={<ButtonSelectionWithJsonDataAndModal />}
      />
    </Routes>
  );
};

export default CreateRoute;
