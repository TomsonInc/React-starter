import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getCurrentUser,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
} from "../services/userService";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const AllUsers = () => {
  const { token, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [usersPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const navigate = useNavigate();

  const allowedRoles = ["ADMIN", "SUPER_ADMIN"];

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getCurrentUser(token);
        setUserDetails(data);

        if (allowedRoles.includes(data.role.name)) {
          const users = await getAllUsers(token);
          setAllUsers(users);
          setFilteredUsers(users);
        }
      } catch (err) {
        console.error("Error fetching user details or all users:", err);
        setError("Unable to fetch user details.");
        logout();
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, [token, logout]);

  // Clear messages after a timeout
  useEffect(() => {
    if (formError || successMessage) {
      const timer = setTimeout(() => {
        setFormError("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formError, successMessage]);

  // Search functionality
  const handleSearch = () => {
    const filtered = allUsers.filter(
      (user) =>
        user.id.toString().includes(searchId) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        user.role.name.toLowerCase().includes(searchRole.toLowerCase()) &&
        (searchStatus === "" || (searchStatus === "Active" && user.enabled) || (searchStatus === "Inactive" && !user.enabled))
    );
    setFilteredUsers(filtered);
    setCurrentPage(0);
  };

  // Pagination calculations
  const offset = currentPage * usersPerPage;
  const paginatedUsers = filteredUsers.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Other actions (Edit, Toggle Status, Delete)
  const handleEditUser = (userId) => navigate(`/users/edit/${userId}`);

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatus(token, id);
      const users = await getAllUsers(token);
      setAllUsers(users);
      setFilteredUsers(users);
    } catch (err) {
      console.error("Error toggling user status:", err);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteUserId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(token, deleteUserId);
      const users = await getAllUsers(token);
      setAllUsers(users);
      setFilteredUsers(users);
      setSuccessMessage("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      setFormError("Failed to delete user. Please try again.");
    } finally {
      setShowDeleteDialog(false);
      setDeleteUserId(null);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!userDetails) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white text-center py-4">
          <h2>Manage Users</h2>
        </div>
        <div className="card-body">
          {allowedRoles.includes(userDetails.role.name) && (
            <>
              {formError && <div className="alert alert-danger">{formError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h4>Search</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Email"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-control"
                        value={searchRole}
                        onChange={(e) => setSearchRole(e.target.value)}
                      >
                        <option value="">All Roles</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="USER">USER</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-control"
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col text-end">
                      <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                    </div>
                  </div>
                </div>
              </div>

              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.role.name}</td>
                      <td>{user.enabled ? "Active" : "Inactive"}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-${user.enabled ? "danger" : "success"} btn-sm ms-2`}
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={user.id === userDetails.id}
                        >
                          {user.enabled ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => handleDeleteConfirmation(user.id)}
                          disabled={user.id === userDetails.id}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center mt-4"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </>
          )}
        </div>
      </div>

      {showDeleteDialog && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteUser}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;