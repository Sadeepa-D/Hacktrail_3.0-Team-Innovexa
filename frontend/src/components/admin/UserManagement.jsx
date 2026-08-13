import React, { useState, useEffect } from "react";
import api from "../../context/apiinstance";
import {
  Users,
  CheckCircle2,
  Search,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  MapPin,
  Loader2,
  RefreshCw,
  Ban,
  UserMinus
} from "lucide-react";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [category, setCategory] = useState("active");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error("Fetch admin users error:", err);
      setUsers([]);
      toast.error("Could not load users list.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isactive: newStatus } : u))
      );
      toast.success(`User status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Update user status error:", err);
      toast.error("Failed to update user status.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User account deleted.");
    } catch (err) {
      console.error("Delete user error:", err);
      toast.error("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const userStatus = u.isactive?.toLowerCase() || "active";
    const matchesCategory = userStatus === category;
    const nameStr = `${u.fname || ""} ${u.lname || ""} ${u.email || ""}`.toLowerCase();
    const matchesSearch = nameStr.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCount = (statusKey) =>
    users.filter((u) => (u.isactive?.toLowerCase() || "active") === statusKey).length;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Category Buttons */}
      <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-3 rounded-2xl flex items-center gap-3 shadow-lg">
        <button
          onClick={() => setCategory("active")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "active"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Active Users</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-emerald-400 font-extrabold border border-emerald-500/30">
            {getCount("active")}
          </span>
        </button>

        <button
          onClick={() => setCategory("deactive")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "deactive"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <Ban className="w-4 h-4 text-amber-300" />
          <span>Deactivated</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-amber-400 font-extrabold border border-amber-500/30">
            {getCount("deactive")}
          </span>
        </button>

        <button
          onClick={() => setCategory("deleted")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "deleted"
              ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/25"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <UserMinus className="w-4 h-4 text-rose-300" />
          <span>Deleted Accounts</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-rose-400 font-extrabold border border-rose-500/30">
            {getCount("deleted")}
          </span>
        </button>
      </div>

      {/* Search & Refresh Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800/90 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/70"
          />
        </div>
        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* User Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <span className="text-sm">Loading users list...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl p-8 bg-slate-900/40">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No {category.toUpperCase()} Users Found</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
            There are currently no user accounts under the "{category}" status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-4 hover:border-slate-700/80 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-md">
                  {(u.fname?.[0] || u.email?.[0] || "U").toUpperCase()}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white truncate">
                      {u.fname || u.lname ? `${u.fname || ""} ${u.lname || ""}`.trim() : "User Account"}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-950 text-violet-300 border border-violet-800/50 uppercase">
                      {u.role || "USER"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-500" />
                    {u.email}
                  </p>
                  {u.city && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {u.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {category !== "active" && (
                    <button
                      onClick={() => handleStatusChange(u.id, "ACTIVE")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Activate</span>
                    </button>
                  )}
                  {category !== "deactive" && (
                    <button
                      onClick={() => handleStatusChange(u.id, "DEACTIVE")}
                      className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800/60 text-amber-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Deactivate</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteUser(u.id)}
                  className="p-1.5 rounded-lg bg-slate-950 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 transition-colors cursor-pointer"
                  title="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
