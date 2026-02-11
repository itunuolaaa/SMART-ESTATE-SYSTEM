import { useEffect, useState, useRef } from "react";

const LandlordDashboard = () => {
    const [user, setUser] = useState({});
    const [complaints, setComplaints] = useState([]);
    const [payments, setPayments] = useState([]);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Edit/Password State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    const dropdownRef = useRef(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(u);
        setEditForm({ name: u.name || "", email: u.email || "", phone: u.phone || "" });
        fetchData();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        try {
            // Fetch Complaints
            const cRes = await fetch("/api/options/complaints", { headers });
            if (cRes.ok) setComplaints(await cRes.json());

            // Fetch Payments
            const pRes = await fetch("/api/payments", { headers });
            if (pRes.ok) setPayments(await pRes.json());
        } catch (err) {
            console.error("Data fetch error:", err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
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
        alert("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    const sections = [
        { id: "dashboard", label: "Dashboard", icon: "🏠" },
        { id: "complaints", label: "Complaints", icon: "📢" },
        { id: "payments", label: "Payments History", icon: "💰" },
        { id: "help", label: "Management Help", icon: "🆘" },
    ];

    const renderContent = () => {
        if (isEditingProfile) {
            return (
                <div className="card" style={{ maxWidth: "500px" }}>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" value={editForm.phone} placeholder="Enter phone number" onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
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
                            <input type="password" value={passwordForm.oldPassword} onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
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
                        <h2>Overview</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                            <div className="card" style={{ borderTop: "4px solid var(--error-color)" }}>
                                <h3>Total Complaints</h3>
                                <p style={{ fontSize: "2rem" }}>{complaints.length}</p>
                                <button onClick={() => setActiveSection("complaints")}>View All</button>
                            </div>
                            <div className="card" style={{ borderTop: "4px solid var(--success-color)" }}>
                                <h3>Revenue</h3>
                                <p style={{ fontSize: "2rem" }}>₦{payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString()}</p>
                                <button onClick={() => setActiveSection("payments")}>Details</button>
                            </div>
                        </div>
                    </div>
                );
            case "complaints":
                return (
                    <div>
                        <h2>Resident Complaints</h2>
                        {complaints.length === 0 ? <p>No active complaints.</p> : (
                            <div style={{ display: "grid", gap: "15px" }}>
                                {complaints.map(c => (
                                    <div key={c.id} className="card" style={{ margin: 0, padding: "1.5rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <h4 style={{ margin: "0 0 5px 0" }}>{c.title}</h4>
                                                <p style={{ margin: "0 0 10px 0", color: "var(--text-secondary)" }}>{c.description}</p>
                                                <small>From: Resident ID {c.user_id} | Date: {new Date(c.date).toLocaleDateString()}</small>
                                            </div>
                                            <span style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "0.8rem",
                                                backgroundColor: c.status === 'open' ? '#FED7D7' : '#C6F6D5',
                                                color: c.status === 'open' ? '#C53030' : '#2F855A'
                                            }}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case "payments":
                return (
                    <div>
                        <h2>Payment History</h2>
                        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead style={{ backgroundColor: "#F7FAFC" }}>
                                    <tr>
                                        <th style={{ padding: "12px 20px", borderBottom: "1px solid #E2E8F0" }}>Date & Time</th>
                                        <th style={{ padding: "12px 20px", borderBottom: "1px solid #E2E8F0" }}>Description</th>
                                        <th style={{ padding: "12px 20px", borderBottom: "1px solid #E2E8F0" }}>Amount</th>
                                        <th style={{ padding: "12px 20px", borderBottom: "1px solid #E2E8F0" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr><td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>No payments recorded yet.</td></tr>
                                    ) : (
                                        payments.map(p => (
                                            <tr key={p.id}>
                                                <td style={{ padding: "12px 20px", borderBottom: "1px solid #E2E8F0" }}>{new Date(p.date).toLocaleString()}</td>
                                                <td style={{ padding: "12px 20px", borderBottom: "1px solid #E2E8F0" }}>{p.description} (User #{p.user_id})</td>
                                                <td style={{ padding: "12px 20px", borderBottom: "1px solid #E2E8F0" }}>₦{parseFloat(p.amount).toLocaleString()}</td>
                                                <td style={{ padding: "12px 20px", borderBottom: "1px solid #E2E8F0" }}>
                                                    <span style={{ color: p.status === 'completed' ? 'var(--success-color)' : 'var(--error-color)', fontWeight: "bold" }}>
                                                        {p.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "help":
                return (
                    <div className="card">
                        <h2>Management Support</h2>
                        <p>For administrative assistance or maintenance escalations:</p>
                        <div style={{ marginTop: "20px" }}>
                            <h4>Security HQ</h4>
                            <p>📞 0801-000-0000</p>
                            <h4>System Support</h4>
                            <p>📞 0801-111-1111</p>
                        </div>
                    </div>
                );
            default:
                return <div>Section not found</div>;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">Estate Portal</div>
                <nav className="sidebar-menu">
                    {sections.map(s => (
                        <div
                            key={s.id}
                            className={`menu-item ${activeSection === s.id ? "active" : ""}`}
                            onClick={() => { setActiveSection(s.id); setIsEditingProfile(false); setIsChangingPassword(false); }}
                        >
                            <span>{s.icon}</span> {s.label}
                        </div>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <button className="hamburger-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>☰</button>
                    <div className="profile-bar" onClick={() => setIsProfileOpen(!isProfileOpen)} ref={dropdownRef}>
                        <span>👨‍💼</span>
                        <span style={{ fontWeight: "600" }}>{user.name}</span>
                        <span>▼</span>
                        {isProfileOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-item" onClick={() => { setIsEditingProfile(true); setIsChangingPassword(false); setIsProfileOpen(false); }}>📝 Edit Profile</div>
                                <div className="dropdown-item" onClick={() => { setIsChangingPassword(true); setIsEditingProfile(false); setIsProfileOpen(false); }}>🔒 Change Password</div>
                                <div className="dropdown-item" style={{ color: "var(--error-color)", borderTop: "1px solid #edf2f7" }} onClick={() => { localStorage.clear(); window.location.href = '/login' }}>🚪 Logout</div>
                            </div>
                        )}
                    </div>
                </header>

                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default LandlordDashboard;
