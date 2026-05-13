import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setError("");
    toast.success("Reset link will be sent if email exists");
    // Simulate the process (you would actually send a request to your backend here)
    setTimeout(() => {
      navigate("/login"); // Redirect to login after the reset process
    }, 2000);
  };

  return (
    <div className="center-container" style={{backgroundColor:"grey"}}>
    <div
      className=" container-fluid d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        backgroundColor: "#f4f7f6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="card p-4 shadow"
        style={{
          width: "400px",
          borderRadius: "10px",
          backgroundColor: "#fff",
        }}
      >
        <h3 className="text-center" style={{ color: "#607d8b" }}>
          Forgot Password
        </h3>
        
        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#607d8b" }}>
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderColor: "#607d8b", borderRadius: "8px" }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              backgroundColor: "#607d8b",
              borderRadius: "8px",
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ForgotPassword;