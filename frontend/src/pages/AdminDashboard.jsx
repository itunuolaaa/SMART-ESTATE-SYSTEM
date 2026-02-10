import { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/payments", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setPayments(await res.json());
        };
        fetchPayments();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>
            <div className="card">
                <h3>Recent Payments</h3>
                <table style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.user_id}</td>
                                <td>₦{p.amount}</td>
                                <td><span style={{ color: p.status === 'completed' ? 'green' : 'orange' }}>{p.status}</span></td>
                                <td>{new Date(p.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href = '/login' }}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
