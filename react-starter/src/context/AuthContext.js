import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      try {
        // Decode the token to extract user details
        const decodedToken = jwtDecode(action.payload);

        return {
          ...state,
          user: {
            id: decodedToken.sub,
            email: decodedToken.sub,
          },
          token: action.payload,
        };
      } catch (error) {
        console.error("Error decoding token:", error.message);
        return { ...state, user: null, token: null };
      }
    case "LOGOUT":
      return { ...state, user: null, token: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwtDecode(token); // Validate token
        dispatch({ type: "LOGIN", payload: token });
      } catch (error) {
        console.error("Invalid token detected. Logging out.");
        localStorage.removeItem("token");
      }
    }
    setIsInitializing(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    dispatch({ type: "LOGIN", payload: token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
