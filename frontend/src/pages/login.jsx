import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
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
    <div style={{ display: "flex", justifyContent: "center", minHeight: "80vh" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <h2>{isRegistering ? "Create Account" : "Access Portal"}</h2>
        {error && <p style={{ color: "var(--error-color)" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {isRegistering && (
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="resident">Resident</option>
              <option value="admin">Admin</option>
              <option value="landlord">Landlord</option>
              <option value="security">Security Personnel</option>
            </select>
          )}

          <button type="submit" style={{ width: "100%" }}>
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          {isRegistering ? "Already have an account?" : "New to Smart Estate?"}{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(!isRegistering); }}>
            {isRegistering ? "Login here" : "Create account"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;