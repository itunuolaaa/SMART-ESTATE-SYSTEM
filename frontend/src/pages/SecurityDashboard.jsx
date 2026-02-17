import { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import {
    Shield,
    QrCode,
    Phone,
    Settings,
    LogOut,
    User,
    Menu,
    ChevronDown,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SecurityDashboard = () => {
    const [user, setUser] = useState({});
    const [qrInput, setQrInput] = useState("");
    const [scanResult, setScanResult] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
        if (!qrInput.trim()) {
            toast.error("Please enter a QR code");
            return;
        }
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
            if (res.ok) {
                setScanResult({ success: true, message: data.message, visitorName: data.visitorName });
                toast.success("Access Granted");
            } else {
                setScanResult({ success: false, message: data.message });
                toast.error("Access Denied: " + data.message);
            }
        } catch (err) {
            console.error("Validation error:", err);
            setScanResult({ success: false, message: "System Connection Error" });
            toast.error("System connection error");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditingProfile(false);
        toast.success("Profile updated successfully!");
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        toast.success("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    const tabs = [
        { id: "scan", label: "Scan QR", icon: <QrCode size={20} /> },
        { id: "contacts", label: "Contacts", icon: <Phone size={20} /> },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const renderContent = () => {
        if (isEditingProfile) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card"
                    style={{ maxWidth: "500px" }}
                >
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
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit">Save Changes</motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" style={{ backgroundColor: "#4B5563" }} onClick={() => setIsEditingProfile(false)}>Cancel</motion.button>
                        </div>
                    </form>
                </motion.div>
            )
        }

        if (isChangingPassword) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card"
                    style={{ maxWidth: "500px" }}
                >
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
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit">Update Password</motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" style={{ backgroundColor: "#4B5563" }} onClick={() => setIsChangingPassword(false)}>Cancel</motion.button>
                        </div>
                    </form>
                </motion.div>
            )
        }

        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: "600px", margin: "0 auto" }}
            >
                {activeTab === 'scan' ? (
                    <motion.div variants={itemVariants} className="card">
                        <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                            <QrCode size={28} /> Visitor Verification
                        </h2>
                        <div className="form-group">
                            <label>Scan or Enter QR Code Token</label>
                            <input
                                style={{ fontSize: "1.2rem", textAlign: "center", letterSpacing: "2px" }}
                                placeholder="e.g. VIS-123456"
                                value={qrInput}
                                onChange={e => setQrInput(e.target.value)}
                            />
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: "100%", padding: "15px", fontSize: "1.1rem" }} onClick={validateQR}>Validate Access</motion.button>

                        <AnimatePresence>
                            {scanResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{
                                        marginTop: "30px",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        backgroundColor: scanResult.success ? "rgba(72, 187, 120, 0.2)" : "rgba(245, 101, 101, 0.2)",
                                        color: scanResult.success ? "#065F46" : "#742A2A",
                                        border: `2px solid ${scanResult.success ? "#48BB78" : "#F56565"}`,
                                        textAlign: "center"
                                    }}
                                >
                                    <h3 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                        {scanResult.success ? <Shield size={24} /> : <Shield size={24} />}
                                        {scanResult.success ? "ACCESS GRANTED" : "ACCESS DENIED"}
                                    </h3>
                                    <p style={{ fontSize: "1.1rem" }}>{scanResult.message}</p>
                                    {scanResult.visitorName && <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "10px" }}>Visitor: {scanResult.visitorName}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div variants={itemVariants} className="card">
                        <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                            <Phone size={28} /> Estate Management
                        </h2>
                        <div style={{ textAlign: "left" }}>
                            <div style={{ padding: "15px", borderBottom: "1px solid #E5E7EB" }}>
                                <strong>Estate Manager</strong>
                                <p style={{ margin: "5px 0", fontSize: "1.1rem" }}>📞 0809-123-4567</p>
                                <p style={{ fontSize: "0.9rem", color: "#6B7280" }}>Available for parking or maintenance issues.</p>
                            </div>
                            <div style={{ padding: "15px", borderBottom: "1px solid #E5E7EB" }}>
                                <strong>Head of Security (Admin)</strong>
                                <p style={{ margin: "5px 0", fontSize: "1.1rem" }}>📞 0802-333-4444</p>
                                <p style={{ fontSize: "0.9rem", color: "#6B7280" }}>Escalate critical incidents here.</p>
                            </div>
                            <div style={{ padding: "15px" }}>
                                <strong>Facility Office</strong>
                                <p style={{ margin: "5px 0", fontSize: "1.1rem" }}>📞 0803-000-1111</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    Security Portal
                </div>
                <nav className="sidebar-menu">
                    {tabs.map(s => (
                        <motion.div
                            key={s.id}
                            className={`menu-item ${activeTab === s.id ? "active" : ""}`}
                            onClick={() => { setActiveTab(s.id); setIsEditingProfile(false); setIsChangingPassword(false); }}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="icon-wrapper">{s.icon}</span>
                            {!isSidebarCollapsed && <span>{s.label}</span>}
                        </motion.div>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <button className="hamburger-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                        <Menu size={24} />
                    </button>
                    <div className="profile-bar" onClick={() => setIsProfileOpen(!isProfileOpen)} ref={dropdownRef}>
                        <div className="avatar-circle">
                            <User size={20} />
                        </div>
                        <span style={{ fontWeight: "600" }}>{user.name}</span>
                        <ChevronDown size={16} />
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="profile-dropdown"
                                >
                                    <div className="dropdown-item" onClick={() => { setIsEditingProfile(true); setIsChangingPassword(false); setIsProfileOpen(false); }}>
                                        <Settings size={16} style={{ marginRight: "8px" }} /> Edit Profile
                                    </div>
                                    <div className="dropdown-item" onClick={() => { setIsChangingPassword(true); setIsEditingProfile(false); setIsProfileOpen(false); }}>
                                        <Shield size={16} style={{ marginRight: "8px" }} /> Change Password
                                    </div>
                                    <div className="dropdown-item" style={{ color: "#EF4444", borderTop: "1px solid #F3F4F6" }} onClick={() => { localStorage.clear(); window.location.href = '/login' }}>
                                        <LogOut size={16} style={{ marginRight: "8px" }} /> Logout
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default SecurityDashboard;
