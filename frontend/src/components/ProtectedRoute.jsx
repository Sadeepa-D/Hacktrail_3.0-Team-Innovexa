import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <Loader2 className="w-9 h-9 text-indigo-500 animate-spin mb-3" />
        <p className="text-slate-400 text-sm font-medium">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
