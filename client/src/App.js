import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link, // ✅ Add Link
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import LearningHub from "./components/LearningHub"; // ✅ Import Learn Component

const App = () => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    username: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    if (token && role && username) {
      setAuth({ token, role, username });
    }
  }, []);

  const handleLogin = ({ role, username }) => {
    const token = localStorage.getItem("token");
    setAuth({ token, role, username });
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, username: null });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md p-4 shadow-md border-b border-white/20 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white drop-shadow">⚙ WorkerBuild</h1>

        {auth.token ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              👋 {auth.username} ({auth.role})
            </span>

            {/* ✅ Learn Link only for workers */}
            {auth.role === "worker" && (
              <Link to="/learn" className="text-white hover:underline text-sm">
                📚 Learn
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <span className="text-white/70 text-sm">Welcome</span>
        )}
      </nav>

      {/* Main Routes */}
      <div className="flex-grow flex items-center justify-center">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={auth.token ? "/dashboard" : "/login"} />}
          />
          <Route
            path="/login"
            element={
              auth.token ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              auth.token ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              auth.token ? (
                <Dashboard user={{ username: auth.username, role: auth.role }} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* ✅ Learn Route */}
          <Route path="/learn" element={<LearningHub />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;