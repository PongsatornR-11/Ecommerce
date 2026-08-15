import React, { useState, useEffect } from "react";
import { getListAllUsers, changeUserStatus, changeUserRole } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { formatDateTime } from "../../utils/datetimeformat";
import { toast } from "react-toastify";
import { Users, Search, UserCheck, UserX } from "lucide-react";

const TableUser = () => {
  const token = useEcomStore((state) => state.token);
  const currentUser = useEcomStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleGetAllUsers = (jwtToken) => {
    setIsLoading(true);
    getListAllUsers(jwtToken)
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (token) {
      handleGetAllUsers(token);
    }
  }, [token]);

  const handleChangeUserStatus = (userId, currentEnabled, email) => {
    if (currentUser.id === userId) {
      toast.error("Cannot modify your own administrator access status");
      return;
    }

    const value = {
      id: userId,
      enabled: !currentEnabled,
    };

    changeUserStatus(token, value)
      .then(() => {
        handleGetAllUsers(token);
        toast.success(`Account for ${email} has been ${value.enabled ? "enabled" : "disabled"}`);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeUserRole = (userId, newRole, email) => {
    if (currentUser.id === userId) {
      toast.error("Cannot modify your own administrator role");
      return;
    }

    const value = {
      id: userId,
      role: newRole,
    };

    changeUserRole(token, value)
      .then(() => {
        handleGetAllUsers(token);
        toast.success(`Role for ${email} updated to ${newRole}`);
      })
      .catch((err) => console.log(err));
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>User Accounts & Permissions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage customer access, role escalations, and account statuses.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
              <th className="pb-3 pl-3">No.</th>
              <th className="pb-3">User</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Access Status</th>
              <th className="pb-3">Registered Date</th>
              <th className="pb-3 pr-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => {
                const isSelf = currentUser.id === user.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {user.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {user.name || "Customer"} {isSelf && "(You)"}
                          </span>
                          <span className="text-[11px] text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <select
                        disabled={isSelf}
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user.id, e.target.value, user.email)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        } ${isSelf ? "cursor-not-allowed opacity-75" : ""}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          user.enabled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {user.enabled ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        <span>{user.enabled ? "Active" : "Suspended"}</span>
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-[11px]">
                      {formatDateTime(user.createdAt)}
                    </td>
                    <td className="py-4 pr-3 text-right">
                      <button
                        disabled={isSelf}
                        onClick={() => handleChangeUserStatus(user.id, user.enabled, user.email)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          isSelf
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : user.enabled
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {user.enabled ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableUser;