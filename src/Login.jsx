import { useState } from "react";
import { login } from "./api.js";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, admin } = await login(username.trim(), password);
      onLogin({ token, admin });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src="/logo.jpg" alt="PathPoint Logo" className="login-logo" />
        <h1>PathPoint</h1>
        <p className="login-subtitle">Admin Panel Login</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

export default Login;
