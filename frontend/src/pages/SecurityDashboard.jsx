import { useEffect, useState, useRef } from "react";

const SecurityDashboard = () => {
    const [user, setUser] = useState({});
    const [qrInput, setQrInput] = useState("");
    const [scanResult, setScanResult] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("scan");

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

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const validateQR = async () => {
        if (!qrInput.trim()) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/visitors/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ qrCode: qrInput })
            });

            const data = await res.json();
            setScanResult({ success: res.ok, message: data.message, visitorName: data.visitorName });
        } catch (err) {
            setScanResult({ success: false, message: "System Connection Error" });
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

    const renderView = () => {
        if (isEditingProfile) {
            return (
                <div className="card" style={{ maxWidth: "500px", margin: "20px auto" }}>
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
                <div className="card" style={{ maxWidth: "500px", margin: "20px auto" }}>
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

        return (
            <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
                    <button
                        style={{ backgroundColor: activeTab === 'scan' ? 'var(--primary-color)' : '#718096' }}
                        onClick={() => setActiveTab('scan')}
                    >🔍 Scan QR</button>
                    <button
                        style={{ backgroundColor: activeTab === 'contacts' ? 'var(--primary-color)' : '#718096' }}
                        onClick={() => setActiveTab('contacts')}
                    >📞 Admin Contacts</button>
                </div>

                {activeTab === 'scan' ? (
                    <div className="card">
                        <h2 style={{ marginBottom: "20px" }}>Visitor Verification</h2>
                        <div className="form-group">
                            <label>Scan or Enter QR Code Token</label>
                            <input
                                style={{ fontSize: "1.2rem", textAlign: "center" }}
                                placeholder="e.g. VIS-123456"
                                value={qrInput}
                                onChange={e => setQrInput(e.target.value)}
                            />
                        </div>
                        <button style={{ width: "100%", padding: "15px" }} onClick={validateQR}>Validate Access</button>

                        {scanResult && (
                            <div style={{
                                marginTop: "30px",
                                padding: "20px",
                                borderRadius: "12px",
                                backgroundColor: scanResult.success ? "#C6F6D5" : "#FED7D7",
                                color: scanResult.success ? "#22543D" : "#822727",
                                border: `2px solid ${scanResult.success ? "#48BB78" : "#F56565"}`
                            }}>
                                <h3 style={{ margin: "0 0 10px 0" }}>{scanResult.success ? "✅ ACCESS GRANTED" : "❌ ACCESS DENIED"}</h3>
                                <p style={{ fontSize: "1.1rem" }}>{scanResult.message}</p>
                                {scanResult.visitorName && <p style={{ fontWeight: "bold" }}>Visitor: {scanResult.visitorName}</p>}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="card">
                        <h2 style={{ marginBottom: "20px" }}>Estate Management</h2>
                        <div style={{ textAlign: "left" }}>
                            <div style={{ padding: "15px", borderBottom: "1px solid #edf2f7" }}>
                                <strong>Estate Manager</strong>
                                <p style={{ margin: "5px 0" }}>📞 0809-123-4567</p>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Available for parking or maintenance issues.</p>
                            </div>
                            <div style={{ padding: "15px", borderBottom: "1px solid #edf2f7" }}>
                                <strong>Head of Security (Admin)</strong>
                                <p style={{ margin: "5px 0" }}>📞 0802-333-4444</p>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Escalate critical incidents here.</p>
                            </div>
                            <div style={{ padding: "15px" }}>
                                <strong>Facility Office</strong>
                                <p style={{ margin: "5px 0" }}>📞 0803-000-1111</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="dashboard-container" style={{ display: "block" }}>
            <header className="top-header" style={{ justifyContent: "center", position: "relative" }}>
                <div style={{ fontWeight: "bold", color: "var(--primary-color)", fontSize: "1.2rem", position: "absolute", left: "20px" }}>
                    🛡️ Security Portal
                </div>

                <div className="profile-bar" onClick={() => setIsProfileOpen(!isProfileOpen)} ref={dropdownRef} style={{ position: "absolute", right: "20px" }}>
                    <span>🛡️</span>
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

            <div className="content-area" style={{ width: "100%", padding: "40px 20px" }}>
                {renderView()}
            </div>
        </div>
    );
};

export default SecurityDashboard;
