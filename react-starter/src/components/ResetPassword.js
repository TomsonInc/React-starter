import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth";
//import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await resetPassword(token, newPassword);
      setMessage("Password has been reset successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              <div className="mb-4 text-center">
                <h2>Reset Password</h2>
                <p className="lead">Enter your new password.</p>
              </div>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="form-control form-control-lg"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="newPassword">New Password</label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control form-control-lg"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;