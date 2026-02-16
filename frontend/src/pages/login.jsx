import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./login.css";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  // ... (keeping existing state) ...
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "resident", // Default role
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // ... (keeping existing logic) ...
    e.preventDefault();
    setError("");
    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    // const url = `http://localhost:5000${endpoint}`; // Use proxy instead
    const url = endpoint;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text(); // Get raw text first
      console.log("Server Response:", text); // Log it for debugging

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server returned non-JSON response. Check console for details.");
      }

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      if (isRegistering) {
        alert("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "resident") navigate("/resident");
        else if (data.user.role === "landlord") navigate("/landlord");
        else if (data.user.role === "security") navigate("/security");
        else navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <button className="back-home-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Back to Home
      </button>
      <div className="login-wrapper">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <h1 className="branding-title">SmartEstate</h1>
            <p className="branding-subtitle">Estate Management Reimagined</p>
            <div className="branding-features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Seamless Management</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Real-time Updates</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Secure Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-wrapper">
          <div className="login-form">
            <div className="form-header">
              <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
              <p className="form-subtitle">
                {isRegistering
                  ? "Join SmartEstate to manage your estate efficiently"
                  : "Sign in to your SmartEstate account"}
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {isRegistering && (
                <div className="form-group">
                  <label htmlFor="role">Select Your Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="resident">Resident</option>
                    <option value="landlord">Landlord</option>
                    <option value="admin">Administrator</option>
                    <option value="security">Security Personnel</option>
                  </select>
                </div>
              )}

              <button type="submit" className="submit-button">
                {isRegistering ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isRegistering ? "Already have an account?" : "New to SmartEstate?"}{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegistering(!isRegistering);
                    setError("");
                  }}
                >
                  {isRegistering ? "Sign in" : "Create account"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
