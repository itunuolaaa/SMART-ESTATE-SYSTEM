import { useEffect, useState, useRef } from "react";
import Chatbot from "../components/Chatbot";

const ResidentDashboard = () => {
    const [user, setUser] = useState({});
    const [dues, setDues] = useState(0);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // QR State
    const [qrCode, setQrCode] = useState(null);
    const [visitorName, setVisitorName] = useState("");
    const [visitDate, setVisitDate] = useState("");

    const [complaintText, setComplaintText] = useState("");
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/options/complaints/lodge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    title: "Resident Complaint",
                    description: complaintText
                })
            });

            if (res.ok) {
                alert("Complaint submitted successfully!");
                setComplaintText("");
            } else {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await res.json();
                    alert(`Failed to submit complaint: ${data.message || 'Unknown error'}`);
                } else {
                    const errorText = await res.text();
                    console.error("Server error response:", errorText);
                    alert(`Server error (${res.status}). Please check if the backend is running correctly.`);
                }
            }
        } catch (err) {
            console.error("Complaint submission error:", err);
            alert("Network error. Please try again later.");
        }
    };
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    const dropdownRef = useRef(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(u);
        setEditForm({ name: u.name || "", email: u.email || "", phone: u.phone || "" });
        fetchDues(u.id);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchDues = async (id) => {
        if (!id) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/payments/dues/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDues(data.amount);
            }
        } catch (err) {
            console.error("Fetch dues error:", err);
        }
    };

    const generateQR = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/visitors/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ residentId: user.id, visitorName, visitDate })
        });
        if (res.ok) {
            const data = await res.json();
            setQrCode(data.qrCode);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        // Mock update for now - in a real app, you'd call an API
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditingProfile(false);
        alert("Profile updated successfully!");
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        // Mock success
        alert("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    const sections = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "payments", label: "Make Payments", icon: "💳" },
        { id: "qr", label: "Generate QR", icon: "📱" },
        { id: "complaints", label: "Make Complaints", icon: "📝" },
        { id: "help", label: "Help", icon: "🆘" },
    ];

    const renderContent = () => {
        if (isEditingProfile) {
            return (
                <div className="card" style={{ maxWidth: "500px" }}>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={editForm.phone}
                                placeholder="Enter phone number"
                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit">Save Changes</button>
                            <button type="button" style={{ backgroundColor: "#718096" }} onClick={() => setIsEditingProfile(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )
        }

        if (isChangingPassword) {
            return (
                <div className="card" style={{ maxWidth: "500px" }}>
                    <h2>Change Password</h2>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label>Old Password</label>
                            <input
                                type="password"
                                value={passwordForm.oldPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit">Update Password</button>
                            <button type="button" style={{ backgroundColor: "#718096" }} onClick={() => setIsChangingPassword(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )
        }

        switch (activeSection) {
            case "dashboard":
                return (
                    <div>
                        <div className="announcement-banner">
                            <span>📢</span>
                            <div>
                                <strong>Announcements</strong>
                                <p style={{ margin: 0, fontSize: "0.9rem" }}>The estate general meeting holds this Saturday at 10 AM.</p>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                            <div className="card">
                                <h3>Quick Summary</h3>
                                <p>Welcome back, <strong>{user.name}</strong>!</p>
                                <p>You have ₦{dues} outstanding dues.</p>
                            </div>
                            <div className="card">
                                <h3>Notifications</h3>
                                <ul style={{ paddingLeft: "20px", textAlign: "left" }}>
                                    <li>Water maintenance scheduled for tomorrow.</li>
                                    <li>Your last payment was successful.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case "payments":
                return (
                    <div className="card" style={{ maxWidth: "500px" }}>
                        <h2>Make Payments</h2>
                        <p>Total Outstanding: <span style={{ color: "var(--error-color)", fontWeight: "bold" }}>₦{dues}</span></p>
                        <button style={{ width: "100%" }}>Proceed to Pay</button>
                    </div>
                );
            case "qr":
                return (
                    <div className="card" style={{ maxWidth: "500px" }}>
                        <h2>Generate Visitor QR</h2>
                        <input
                            placeholder="Visitor Name"
                            value={visitorName}
                            onChange={e => setVisitorName(e.target.value)}
                        />
                        <input
                            type="date"
                            value={visitDate}
                            onChange={e => setVisitDate(e.target.value)}
                        />
                        <button style={{ width: "100%" }} onClick={generateQR}>Generate Code</button>
                        {qrCode && (
                            <div style={{ marginTop: "20px", background: "#f7fafc", padding: "15px", borderRadius: "8px", textAlign: "center", border: "1px dashed #cbd5e0" }}>
                                <div style={{ fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "2px" }}>{qrCode}</div>
                                <p><small>Valid for: {visitDate}</small></p>
                            </div>
                        )}
                    </div>
                );
            case "complaints":
                return (
                    <div className="card" style={{ maxWidth: "500px" }}>
                        <h2>Make Complaints</h2>
                        <p>Have an issue? You can lodge it here or use our chatbot assistant.</p>
                        <textarea
                            placeholder="Describe the issue..."
                            style={{ minHeight: "100px" }}
                            value={complaintText}
                            onChange={(e) => setComplaintText(e.target.value)}
                        ></textarea>
                        <button style={{ width: "100%", marginBottom: "10px" }} onClick={handleSubmitComplaint}>Submit Complaint</button>
                        <button
                            style={{ width: "100%", backgroundColor: "var(--accent-color)" }}
                            onClick={() => setIsChatbotOpen(true)}
                        >
                            Chat with Assistant
                        </button>
                    </div>
                );
            case "help":
                return (
                    <div className="card">
                        <h2>Help & Emergency Contacts</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
                            <div>
                                <h4>Security Desk</h4>
                                <p>📞 0801-234-5678</p>
                                <p>📧 security@smartestate.com</p>
                            </div>
                            <div>
                                <h4>Estate Manager</h4>
                                <p>📞 0809-876-5432</p>
                                <p>📧 manager@smartestate.com</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Select a section</div>;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">Smart Estate</div>
                <nav className="sidebar-menu">
                    {sections.map(s => (
                        <div
                            key={s.id}
                            className={`menu-item ${activeSection === s.id ? "active" : ""}`}
                            onClick={() => {
                                setActiveSection(s.id);
                                setIsEditingProfile(false);
                                setIsChangingPassword(false);
                            }}
                        >
                            <span>{s.icon}</span> {s.label}
                        </div>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <button className="hamburger-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                        ☰
                    </button>
                    <div className="profile-bar" onClick={() => setIsProfileOpen(!isProfileOpen)} ref={dropdownRef}>
                        <span>👤</span>
                        <span style={{ fontWeight: "600" }}>{user.name}</span>
                        <span>▼</span>
                        {isProfileOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-item" onClick={() => {
                                    setIsEditingProfile(true);
                                    setIsChangingPassword(false);
                                    setIsProfileOpen(false);
                                }}>📝 Edit Profile</div>
                                <div className="dropdown-item" onClick={() => {
                                    setIsChangingPassword(true);
                                    setIsEditingProfile(false);
                                    setIsProfileOpen(false);
                                }}>🔒 Change Password</div>
                                <div className="dropdown-item" style={{ color: "var(--error-color)", borderTop: "1px solid #edf2f7" }} onClick={() => { localStorage.clear(); window.location.href = '/login' }}>🚪 Logout</div>
                            </div>
                        )}
                    </div>
                </header>

                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
            <Chatbot isOpen={isChatbotOpen} setIsOpen={setIsChatbotOpen} />
        </div>
    );
};

export default ResidentDashboard;
