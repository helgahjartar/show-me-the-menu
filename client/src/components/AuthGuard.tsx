import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import { initializeAuth } from "../api/client";

export function AuthGuard() {
  const { isAuthenticated, isLoading, error, loginWithRedirect, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !error) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, error, loginWithRedirect]);

  useEffect(() => {
    if (isAuthenticated) {
      initializeAuth(async () => {
        try {
          return await getAccessTokenSilently();
        } catch {
          await loginWithRedirect();
          return "";
        }
      });
    }
  }, [isAuthenticated, getAccessTokenSilently, loginWithRedirect]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-600">Authentication error: {error.message}</p>
        <button
          onClick={() => loginWithRedirect()}
          className="px-4 py-2 rounded bg-primary text-white hover:opacity-90"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted">Redirecting to login...</p>
      </div>
    );
  }

  return <Outlet />;
}
