import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Base URL from .env

//Get all users
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// Get current user details
export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current user details:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (token, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// Get user details by ID
export const getUserDetails = async (token, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user-details/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};


//Update user details
export const updateUserDetails = async (token, userId, payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user-details/${userId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

// Create a new user
export const createUser = async (token, payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Toggle user status (Activate/Deactivate)
export const toggleUserStatus = async (token, userId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}/toggle-status`,
      {}, // An empty object is passed as the body for PUT
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling user status:", error.response || error.message);
    throw error;
  }
};


//Delete a user
export const deleteUser = async (token, userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

//get user bases on roleid 
export const getUsersByRole = async (roleId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching users with role ID ${roleId}:`, error);
    throw error;
  }
};
