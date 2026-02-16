import { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import {
    Home,
    Wrench,
    DollarSign,
    HelpCircle,
    Bell,
    Settings,
    LogOut,
    Menu,
    Search,
    User,
    ChevronDown,
    LayoutDashboard,
    FileText,
    CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
            toast.error("Failed to load dashboard data");
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

    const sections = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "complaints", label: "Complaints", icon: <FileText size={20} /> },
        { id: "payments", label: "Payments History", icon: <CreditCard size={20} /> },
        { id: "help", label: "Management Help", icon: <HelpCircle size={20} /> },
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

        switch (activeSection) {
            case "dashboard":
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h2>Overview</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                            <motion.div variants={itemVariants} className="card" style={{ borderTop: "4px solid var(--error-color)" }}>
                                <h3>Total Complaints</h3>
                                <p style={{ fontSize: "2rem" }}>{complaints.length}</p>
                                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setActiveSection("complaints")}>View All</motion.button>
                            </motion.div>
                            <motion.div variants={itemVariants} className="card" style={{ borderTop: "4px solid var(--success-color)" }}>
                                <h3>Revenue</h3>
                                <p style={{ fontSize: "2rem" }}>₦{payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString()}</p>
                                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setActiveSection("payments")}>Details</motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                );
            case "complaints":
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h2>Resident Complaints</h2>
                        {complaints.length === 0 ? <p>No active complaints.</p> : (
                            <div style={{ display: "grid", gap: "15px" }}>
                                {complaints.map(c => (
                                    <motion.div variants={itemVariants} key={c.id} className="card" style={{ margin: 0, padding: "1.5rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <h4 style={{ margin: "0 0 5px 0" }}>{c.title}</h4>
                                                <p style={{ margin: "0 0 10px 0", color: "var(--text-secondary)" }}>{c.description}</p>
                                                <small>From: <strong>{c.user_name || `Resident #${c.user_id}`}</strong> | Date: {new Date(c.date).toLocaleDateString()}</small>
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
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                );
            case "payments":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2>Payment History</h2>
                        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead style={{ backgroundColor: "#1F2937", color: "white" }}>
                                    <tr>
                                        <th style={{ padding: "12px 20px" }}>Date & Time</th>
                                        <th style={{ padding: "12px 20px" }}>Description</th>
                                        <th style={{ padding: "12px 20px" }}>Amount</th>
                                        <th style={{ padding: "12px 20px" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr><td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>No payments recorded yet.</td></tr>
                                    ) : (
                                        payments.map(p => (
                                            <tr key={p.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                                                <td style={{ padding: "12px 20px" }}>{new Date(p.date).toLocaleString()}</td>
                                                <td style={{ padding: "12px 20px" }}>{p.description} (User #{p.user_id})</td>
                                                <td style={{ padding: "12px 20px" }}>₦{parseFloat(p.amount).toLocaleString()}</td>
                                                <td style={{ padding: "12px 20px" }}>
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
                    </motion.div >
                );
            case "help":
                return (
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="card"
                    >
                        <h2>Management Support</h2>
                        <p>For administrative assistance or maintenance escalations:</p>
                        <div style={{ marginTop: "20px" }}>
                            <h4>Security HQ</h4>
                            <p>📞 0801-000-0000</p>
                            <h4>System Support</h4>
                            <p>📞 0801-111-1111</p>
                        </div>
                    </motion.div>
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
                        <motion.div
                            key={s.id}
                            className={`menu-item ${activeSection === s.id ? "active" : ""}`}
                            onClick={() => { setActiveSection(s.id); setIsEditingProfile(false); setIsChangingPassword(false); }}
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
                    <div className="header-search">
                        <Search size={20} color="#9CA3AF" />
                        <input type="text" placeholder="Search..." />
                    </div>
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
                                        <Wrench size={16} style={{ marginRight: "8px" }} /> Change Password
                                    </div>
                                    <div className="dropdown-item" style={{ color: "var(--error-color)", borderTop: "1px solid #edf2f7" }} onClick={() => { localStorage.clear(); window.location.href = '/login' }}>
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

export default LandlordDashboard;
