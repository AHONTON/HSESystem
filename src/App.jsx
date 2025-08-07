import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { ThemeProvider } from "./components/contexts/ThemeContext";
import { NotificationProvider } from "./components/contexts/NotificationContext";
import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Technicians from "./pages/Technicians";
import EPIStock from "./pages/EPIStock";
import Incidents from "./pages/Incidents";
import Reports from "./pages/Reports";
import Statistics from "./pages/Statistics";
import Training from "./pages/Training";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import ErrorBoundary from "./components/UI/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Auth page unique pour Login et Register */}
                <Route path="/auth" element={<AuthPage />} />

                {/* Redirections vers /auth */}
                <Route
                  path="/login"
                  element={<Navigate to="/auth" replace />}
                />
                <Route
                  path="/register"
                  element={<Navigate to="/auth" replace />}
                />

                {/* Routes protégées */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="technicians" element={<Technicians />} />
                  <Route path="epi-stock" element={<EPIStock />} />
                  <Route path="incidents" element={<Incidents />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="training" element={<Training />} />
                </Route>

                {/* Redirection pour toute route inconnue */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
