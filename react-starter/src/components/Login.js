import React, { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate , Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(credentials);

      // Save token via AuthContext
      login(data.token);

      console.log("User logged in with token:", data.token);

      // Navigate to dashboard
      navigate("/dashboard");

      // Reload the page
      window.location.reload();
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError("");
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              
              <div className="mb-4 text-center">
                <h2>Welcome to ElevateNex NextGen HR System</h2>
                <p className="lead">Streamline your HR processes with our innovative platform.</p>
                <p>Please login to access your account</p>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={handleCloseError}></button>
                </div>
              )}

              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
                <label className="form-label" htmlFor="email">Email address</label>
              </div>

              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <label className="form-label" htmlFor="password">Password</label>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <Link to="/forgot-password" className="text-body">Forgot password?</Link>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;