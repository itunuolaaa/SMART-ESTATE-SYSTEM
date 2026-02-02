import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
  return window.location.pathname === "/dashboard"
    ? <Dashboard />
    : <Login />;
}

export default App;
