import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css"; // or "./main.css" depending on your filename


ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-srjh0iqv1gcqrmqn.us.auth0.com"
    clientId="TnQR2ga4FdXhlyLzNpOxrOLFAvnwKTtc"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://dev-srjh0iqv1gcqrmqn.us.auth0.com/api/v2/",
    }}
    cacheLocation="localstorage"  // 👈 important!
  >
    <App />
  </Auth0Provider>
);