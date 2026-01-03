import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route
          path="/dashboard"
          element={
            // <RequireAuth>
              <Dashboard />
            // </RequireAuth>
          }
        />
        <Route
          path="/bills"
          element={
            // <RequireAuth>
              <Bills />
            // </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
