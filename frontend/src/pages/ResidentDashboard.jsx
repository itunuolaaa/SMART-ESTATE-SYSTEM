import { useEffect, useState } from "react";
import Chatbot from "../components/Chatbot";

const ResidentDashboard = () => {
    const [user, setUser] = useState({});
    const [dues, setDues] = useState(0);
    const [qrCode, setQrCode] = useState(null);
    const [visitorName, setVisitorName] = useState("");
    const [visitDate, setVisitDate] = useState("");

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        setUser(u);
        fetchDues(u.id);
    }, []);

    const fetchDues = async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/payments/dues/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setDues(data.amount);
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

    return (
        <div style={{ padding: "20px" }}>
            <h1>Welcome, {user.name}</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="card">
                    <h3>Outstanding Dues</h3>
                    <p style={{ fontSize: "2rem", color: "var(--error-color)" }}>₦{dues}</p>
                    <button>Pay Now</button>
                </div>

                <div className="card">
                    <h3>Generate Visitor QR</h3>
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
                    <button onClick={generateQR}>Generate Code</button>

                    {qrCode && (
                        <div style={{ marginTop: "10px", background: "#f0f0f0", padding: "10px", wordBreak: "break-all" }}>
                            <strong>Code:</strong> {qrCode}
                            <br />
                            <small>(Show this code to security)</small>
                        </div>
                    )}
                </div>
            </div>

            <button style={{ marginTop: "20px", backgroundColor: "#E53E3E" }} onClick={() => { localStorage.clear(); window.location.href = '/login' }}>Logout</button>
            <Chatbot />
        </div>
    );
};

export default ResidentDashboard;
