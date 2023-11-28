// index.js
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import CreateRoute from "./CreateRoute";

ReactDOM.render(
  <BrowserRouter>
    <CreateRoute />
  </BrowserRouter>,
  document.getElementById("root")
);
