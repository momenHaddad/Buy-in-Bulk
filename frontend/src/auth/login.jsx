import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  }

  return (
    <div className="main">
      <div className="login">
        <h1>Welcome Back</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            <strong>Email:</strong> 
            <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
          </label>
          <br />
          <label>
            <strong>Password:</strong>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </label>
          <br />
          <button type="submit">{loading ? 'Logging in...' : 'Log in'}</button>
        </form>
        <p>Don't have an account?<Link to="/register"> Sign Up</Link></p>
      </div>
      <div className="image"></div>
    </div>
  );
}

export default Login;