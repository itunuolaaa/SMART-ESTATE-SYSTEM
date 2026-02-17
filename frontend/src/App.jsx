import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';
import LandingPage from "./pages/LandingPage";
import Login from "./pages/login";
import ResidentDashboard from "./pages/ResidentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/resident" element={
          <ProtectedRoute>
            <ResidentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/landlord" element={
          <ProtectedRoute>
            <LandlordDashboard />
          </ProtectedRoute>
        } />

        <Route path="/security" element={
          <ProtectedRoute>
            <SecurityDashboard />
          </ProtectedRoute>
        } />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
