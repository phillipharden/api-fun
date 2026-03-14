import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
//? -----CSS-------------------------------------------------------------------------
import "./css/App.css";
import './css/pages.css';
import './css/components.css';

import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);