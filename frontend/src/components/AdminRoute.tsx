import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [apiRoles, setApiRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      if (auth.user?.access_token) {
        try {
          const res = await axios.get("/api/users/me", {
            baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
            headers: { Authorization: `Bearer ${auth.user.access_token}` },
          });
          setApiRoles(res.data.roles || []);
        } catch (e) {
          setApiRoles([]);
        }
      }
      setLoadingRoles(false);
    };
    fetchRoles();
  }, [auth.user?.access_token]);

  if (auth.isLoading || loadingRoles) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></span>
      </div>
    );
  }

  if (!apiRoles.includes("admin")) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-6">You do not have permission to access the admin panel.</p>
          <a
            href="/"
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FiArrowLeft className="mr-2" /> Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
