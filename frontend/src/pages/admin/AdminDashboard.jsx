import React from "react";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin.</p>

      <ul>
        <li>View Users</li>
        <li>View Payments</li>
        <li>View Maintenance Requests</li>
        <li>View Visitor Logs</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
