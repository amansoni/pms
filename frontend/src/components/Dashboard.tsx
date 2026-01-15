import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import api from "../services/api";

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const [apiResult, setApiResult] = useState<string | null>(null);

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <span className="text-blue-700">Loading...</span>
        </div>
      </div>
    );
  }

  const user = auth.user?.profile || {};
  const roles = user?.realm_access?.roles || [];

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  const testApi = async () => {
    setApiResult("Loading...");
    try {
      const res = await api.get("/api/users/me");
      setApiResult(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setApiResult("Error: " + (err.response?.status || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center pt-12">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Dashboard</h1>
        <div className="mb-4">
          <div>
            <strong>Email:</strong> {user.email || user.preferred_username}
          </div>
          <div>
            <strong>Name:</strong> {user.name || "-"}
          </div>
          <div>
            <strong>Roles:</strong> {roles.join(", ") || "-"}
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={testApi}
        >
          Test /api/users/me
        </button>
        {apiResult && (
          <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{apiResult}</pre>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
