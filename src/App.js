import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Registration from "./components/Registration";
import Dashboard from "./pages/Dashboard";
import Interview_Q_App from "./components/Interview_Q_App";
import Result from "./pages/Result";

function App() {

  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/register" element={<Registration />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* INTERVIEW */}
        <Route
          path="/interview"
          element={
            user ? (
              <Interview_Q_App user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* RESULT */}
        <Route
          path="/result"
          element={
            user ? (
              <Result user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
