import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    // Store token globally for axios interceptor
    if (auth.user?.access_token) {
      (window as any).authToken = auth.user.access_token;
    }
  }, [auth.user]);

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <span className="text-blue-700">Loading...</span>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
