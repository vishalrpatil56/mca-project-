import React from "react";
import { Navigate } from "react-router-dom";

//checks if the user is logged in
const PrivateRoute = ({ element }) => {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    // Redirect to login if not authenticated
    return <Navigate to="/Adminpenal" />;
  }

  return element;
};

export default PrivateRoute;
