import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const UserRegistration = ({ onUserAdded }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    email: "",
    role: "USER",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formError || successMessage) {
      const timer = setTimeout(() => {
        setFormError("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formError, successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!newUser.email || !newUser.password || !newUser.confirmPassword) {
      setFormError("All fields are required.");
      setLoading(false);
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setFormError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await createUser(token, {
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
      });
      setNewUser({ email: "", role: "USER", password: "", confirmPassword: "" });
      setSuccessMessage("User created successfully!");
      setTimeout(() => navigate("/all-users"), 2500);
      if (onUserAdded) {
        onUserAdded(); // Refresh user list in parent component
      }
    } catch (err) {
      setFormError(err.response?.status === 409 ? "User with this email already exists." : "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard"); // Redirect to Dashboard
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>
                Register New User
              </h2>
              <p className="mb-0 mt-2 opacity-75">Fill in the details to create a new user</p>
            </div>

            <div className="card-body p-4">
              {formError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {formError}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {successMessage}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="needs-validation" noValidate>
                <div className="bg-light p-4 rounded-3 mb-4">
                  <h4 className="text-primary mb-4">
                    <i className="bi bi-info-circle me-2"></i>User Information
                  </h4>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={newUser.email}
                        onChange={handleChange}
                        placeholder="Enter user email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="role" className="form-label">
                      Role <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-badge"></i>
                      </span>
                      <select
                        id="role"
                        name="role"
                        className="form-control"
                        value={newUser.role}
                        onChange={handleChange}
                      >
                        <option value="USER">USER</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        value={newUser.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                        value={newUser.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-center mt-4">
                  <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={handleCancel} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg px-5" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-2"></i>
                        Register User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer text-center py-3 bg-light">
              <p className="text-muted mb-0">
                <i className="bi bi-shield-check me-2"></i>
                All fields marked with <span className="text-danger">*</span> are required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
