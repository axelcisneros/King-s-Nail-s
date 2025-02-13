import React from "react";
import ReactDOM from "react-dom/client";
import App from "@component/App";
import Background from "@component/Background/Background";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <Background>
     <App />
     </Background>
    </BrowserRouter>
    </React.StrictMode>
);