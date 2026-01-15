import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import authConfig from "./auth-config";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserManagement from "./pages/admin/UserManagement";
import GroupManagement from "./pages/admin/GroupManagement";
import Navigation from "./components/Navigation";

const Callback: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-blue-50">
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-xl font-bold text-blue-700">Authenticating...</h2>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider {...authConfig}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/users" element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } />
          <Route path="/admin/groups" element={
            <AdminRoute>
              <GroupManagement />
            </AdminRoute>
          } />
          <Route path="/callback" element={<Callback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
