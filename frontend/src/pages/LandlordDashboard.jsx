import { useEffect, useState } from "react";

const LandlordDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch Complaints
            const cRes = await fetch("/api/options/complaints", { headers }); // Assuming landlord can see all
            if (cRes.ok) setComplaints(await cRes.json());

            // Fetch Payments
            const pRes = await fetch("/api/payments", { headers });
            if (pRes.ok) setPayments(await pRes.json());
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Landlord Dashboard</h1>

            <div className="card">
                <h3>Resident Complaints</h3>
                <ul>
                    {complaints.map(c => (
                        <li key={c.id}>
                            <strong>{c.title}</strong> - {c.description} <br />
                            <small>Status: {c.status}</small>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card">
                <h3>Payment Overview</h3>
                <p>Total Payments Recorded: {payments.length}</p>
                <p>Total Amount: ₦{payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}</p>
            </div>

            <button onClick={() => { localStorage.clear(); window.location.href = '/login' }}>Logout</button>
        </div>
    );
};

export default LandlordDashboard;
