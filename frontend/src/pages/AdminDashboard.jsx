import { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import {
    Users,
    CreditCard,
    FileText,
    Shield,
    LogOut,
    Menu,
    Search,
    Bell,
    Settings,
    User,
    ChevronDown,
    LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const AdminDashboard = () => {
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);
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
        fetchAllData();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchAllData = async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        try {
            // Fetch All Users
            const uRes = await fetch("/api/users", { headers });
            if (uRes.ok) setUsers(await uRes.json());

            // Fetch Complaints
            const cRes = await fetch("/api/options/complaints", { headers });
            if (cRes.ok) setComplaints(await cRes.json());

            // Fetch Payments
            const pRes = await fetch("/api/payments", { headers });
            if (pRes.ok) setPayments(await pRes.json());
        } catch (err) {
            console.error("Admin data fetch error:", err);
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
        { id: "users", label: "Manage Users", icon: <Users size={20} /> },
        { id: "complaints", label: "Complaints", icon: <FileText size={20} /> },
        { id: "payments", label: "All Payments", icon: <CreditCard size={20} /> },
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
                        <h2>System Overview</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                            <motion.div variants={itemVariants} className="card" style={{ borderTop: "4px solid #14B8A6" }}>
                                <h4>Total Users</h4>
                                <p style={{ fontSize: "2rem" }}>{users.length}</p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="card" style={{ borderTop: "4px solid #F56565" }}>
                                <h4>Open Complaints</h4>
                                <p style={{ fontSize: "2rem" }}>{complaints.filter(c => c.status === 'open').length}</p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="card" style={{ borderTop: "4px solid #48BB78" }}>
                                <h4>Total Revenue</h4>
                                <p style={{ fontSize: "2rem" }}>₦{payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString()}</p>
                            </motion.div>
                        </div>
                    </motion.div>
                );
            case "users":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                        style={{ padding: "0", overflow: "hidden" }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead style={{ backgroundColor: "#1F2937", color: "white" }}>
                                <tr>
                                    <th style={{ padding: "12px 20px" }}>ID</th>
                                    <th style={{ padding: "12px 20px" }}>Name</th>
                                    <th style={{ padding: "12px 20px" }}>Email</th>
                                    <th style={{ padding: "12px 20px" }}>Phone</th>
                                    <th style={{ padding: "12px 20px" }}>Role</th>
                                    <th style={{ padding: "12px 20px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                                        <td style={{ padding: "12px 20px" }}>#{u.id}</td>
                                        <td style={{ padding: "12px 20px" }}>{u.name}</td>
                                        <td style={{ padding: "12px 20px" }}>{u.email}</td>
                                        <td style={{ padding: "12px 20px" }}>{u.phone || "N/A"}</td>
                                        <td style={{ padding: "12px 20px" }}>
                                            <span style={{
                                                textTransform: "capitalize",
                                                padding: "2px 8px",
                                                borderRadius: "4px",
                                                backgroundColor: u.role === 'admin' ? '#065F46' : '#E5E7EB',
                                                color: u.role === 'admin' ? '#10B981' : '#374151',
                                                fontSize: "0.85rem",
                                                fontWeight: "500"
                                            }}>{u.role}</span>
                                        </td>
                                        <td style={{ padding: "12px 20px" }}>
                                            <button style={{ backgroundColor: "#EF4444", padding: "6px 12px", fontSize: "0.8rem" }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                );
            case "complaints":
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ display: "grid", gap: "10px" }}
                    >
                        {complaints.map(c => (
                            <motion.div variants={itemVariants} key={c.id} className="card" style={{ margin: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <strong>{c.title}</strong>
                                    <span style={{
                                        color: c.status === 'open' ? '#EF4444' : '#10B981',
                                        fontWeight: "600"
                                    }}>{c.status.toUpperCase()}</span>
                                </div>
                                <p style={{ color: "#4B5563", marginTop: "0.5rem" }}>{c.description}</p>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.85rem", color: "#6B7280" }}>
                                    <span>From: <strong>{c.user_name || `User #${c.user_id}`}</strong></span>
                                    <span>{new Date(c.date).toLocaleString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                );
            case "payments":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                        style={{ padding: "0", overflow: "hidden" }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={{ backgroundColor: "#1F2937", color: "white" }}>
                                <tr>
                                    <th style={{ padding: "12px 20px" }}>User</th>
                                    <th style={{ padding: "12px 20px" }}>Amount</th>
                                    <th style={{ padding: "12px 20px" }}>Date</th>
                                    <th style={{ padding: "12px 20px" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                                        <td style={{ padding: "12px 20px" }}>#{p.user_id}</td>
                                        <td style={{ padding: "12px 20px", fontWeight: "600" }}>₦{parseFloat(p.amount).toLocaleString()}</td>
                                        <td style={{ padding: "12px 20px" }}>{new Date(p.date).toLocaleDateString()}</td>
                                        <td style={{ padding: "12px 20px" }}>
                                            <span style={{
                                                color: p.status === 'completed' ? '#10B981' : '#F59E0B',
                                                fontWeight: "600"
                                            }}>{p.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                );
            default:
                return <div>Section not found</div>;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    Admin Portal
                </div>
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

export default AdminDashboard;
