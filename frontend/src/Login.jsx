import { useState } from "react";
import { login } from "./api";
import RegisterForm from "./RegisterForm";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setIsLoading(true);

      if (!username.trim() || !password.trim()) {
        setError("Username and password are required");
        setIsLoading(false);
        return;
      }

      if (username.length < 3) {
        setError("Username must be at least 3 characters");
        setIsLoading(false);
        return;
      }

      const res = await login({ username, password });
      if (!res.token) throw new Error("Login failed");

      localStorage.setItem("token", res.token);
      onLogin(res.token);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || "Login failed");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (showRegister) {
    return (
      <RegisterForm
        onSuccess={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Task Manager</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div className="button-group">
          <button
            onClick={handleLogin}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button
            onClick={() => {
              setShowRegister(true);
              setError("");
            }}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}