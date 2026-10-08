import { useState } from "react";
import { register } from "./api";

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      setSuccess("");
      setIsLoading(true);

      if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      if (username.length < 3) {
        setError("Username must be at least 3 characters");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      await register({ username, password });
      setSuccess("Account created successfully! Switching to login...");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);

      setIsLoading(false);
    } catch (err) {
      setError(err.message || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleRegister}>
          <h2>Create Account</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              disabled={isLoading}
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              disabled={isLoading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              disabled={isLoading}
              minLength="6"
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
