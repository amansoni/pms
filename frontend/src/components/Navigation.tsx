import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Navigation: React.FC = () => {
  const auth = useAuth();
  const location = useLocation();
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

  const isAdmin = apiRoles.includes("admin");

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">Galea Care Admin</Link>
      <div className="flex gap-4 items-center">
        {loadingRoles ? null : isAdmin && (
          <div className="relative group">
            <button className="px-3 py-2 rounded hover:bg-blue-700 focus:outline-none">
              Admin
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white text-blue-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to="/admin/users"
                className={`block px-4 py-2 hover:bg-blue-100 ${location.pathname === "/admin/users" ? "bg-blue-100" : ""}`}
              >
                Manage Users
              </Link>
              <Link
                to="/admin/groups"
                className={`block px-4 py-2 hover:bg-blue-100 ${location.pathname === "/admin/groups" ? "bg-blue-100" : ""}`}
              >
                Manage Groups
              </Link>
              <Link
                to="/admin/audit"
                className={`block px-4 py-2 hover:bg-blue-100 ${location.pathname === "/admin/audit" ? "bg-blue-100" : ""}`}
              >
                View Audit Logs
              </Link>
            </div>
          </div>
        )}
        <Link to="/" className="px-3 py-2 rounded hover:bg-blue-700">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navigation;
