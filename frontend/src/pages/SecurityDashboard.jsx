import { useState } from "react";

const SecurityDashboard = () => {
    const [qrInput, setQrInput] = useState("");
    const [scanResult, setScanResult] = useState(null);

    const validateQR = async () => {
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
            setScanResult({ success: false, message: "System Error" });
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Security Checkpoint</h1>

            <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <h3>Verify Visitor</h3>
                <input
                    placeholder="Enter QR Code Token"
                    value={qrInput}
                    onChange={e => setQrInput(e.target.value)}
                />
                <button onClick={validateQR}>Validate Access</button>

                {scanResult && (
                    <div style={{
                        marginTop: "20px",
                        padding: "20px",
                        borderRadius: "8px",
                        backgroundColor: scanResult.success ? "var(--success-color)" : "var(--error-color)",
                        color: "white"
                    }}>
                        <h3>{scanResult.success ? "✅ ACCESS GRANTED" : "❌ ACCESS DENIED"}</h3>
                        <p>{scanResult.message}</p>
                        {scanResult.visitorName && <p>Visitor: <strong>{scanResult.visitorName}</strong></p>}
                    </div>
                )}
            </div>

            <button style={{ marginTop: "20px" }} onClick={() => { localStorage.clear(); window.location.href = '/login' }}>Logout</button>
        </div>
    );
};

export default SecurityDashboard;
