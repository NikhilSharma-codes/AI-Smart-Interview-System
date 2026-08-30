import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Login successful!");
        onLogin(data.user);
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Interview AI</h1>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
          <p>
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;