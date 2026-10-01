import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./styles.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.post("/auth/register", { username, email, password });
      Navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="main">
      <div className="login">
        <h1>Register</h1>
        {error && <p role="alert">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Register</button>
        </form>
      </div>
      <div className="image"></div>
    </div>
  );
};

export default Register;
