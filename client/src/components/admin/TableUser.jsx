import React, { useState, useEffect } from 'react'

// api
import { getListAllUsers, changeUserStatus, changeUserRole } from '../../api/admin'

// global state
import useEcomStore from '../../store/ecom-store'

import { useCurrentTime, formatDateTime } from '../../utils/datetimeformat'
import { toast } from 'react-toastify'

const TableUser = () => {
    const token = useEcomStore((state) => state.token)
    const CurrentUser = useEcomStore((state) => state.user)
    const [users, setUsers] = useState([])

    const handleGetAllUsers = (token) => {
        getListAllUsers(token)
            .then((res) => {
                setUsers(res.data)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        handleGetAllUsers(token)
    }, [])

    const handleChangeUserStatus = (userId, userStatus, email) => {
        const value = {
            id: userId,
            enabled: !userStatus
        }

        // check if the current logged-in user is trying to change his/her status
        if (CurrentUser.id === userId) {
            console.log('Cannot change status of the current logged-in user')
            toast.error("Cannot change status of the current logged-in user");
            return;
        }

        changeUserStatus(token, value)
            .then(() => {
                handleGetAllUsers(token)
                toast.success(`${email} ${value.enabled ? 'enabled' : 'disabled'} successfully`);
            })
            .catch((err) => console.log(err))
    }

    const handleChangeUserRole = (userId, userRole, email) => {
        const value = {
            id: userId,
            role: userRole
        }
        // check if the current logged-in user is trying to change his/her role
        if (CurrentUser.id === userId) {
            console.log('Cannot change role of the current logged-in user')
            toast.error("Cannot change role of the current logged-in user");
            return;
        }

        changeUserRole(token, value)
            .then(() => {
                handleGetAllUsers(token)
                toast.success(`${email} changed to ${userRole} successfully`);
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-colors duration-200">
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4'>
                <div className='flex flex-col'>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">All Users</h2>
                    <span className='text-xs text-slate-455 dark:text-slate-400 mt-1'>
                        Current logged-in user: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{CurrentUser.email}</span>
                    </span>
                </div>
                <div className='text-xs font-semibold text-slate-400 dark:text-slate-500'>
                    <span>{useCurrentTime()}</span>
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden border border-slate-100 dark:border-slate-800/80 rounded-xl bg-white dark:bg-slate-950 shadow-sm mt-4">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center w-12">No.</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Email Address</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center w-28">Role</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center w-28">Status</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Updated At</th>
                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                        {users.map((user, index) => (
                            <tr key={index} className="text-slate-650 dark:text-slate-350 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                                <td className="px-4 py-3.5 text-center text-xs font-medium">{index + 1}</td>
                                <td className="px-4 py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200">{user.name || 'N/A'}</td>
                                <td className="px-4 py-3.5 text-xs font-medium">{user.email}</td>

                                <td className="px-4 py-3.5 text-center">
                                    <select
                                        className={`text-[10px] font-bold p-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer`}
                                        onChange={(e) => handleChangeUserRole(user.id, e.target.value, user.email)}
                                        value={user.role}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </td>

                                <td className="px-4 py-3.5 text-center">
                                    <button
                                        className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition-all duration-200 shadow-sm ${
                                            user.enabled 
                                                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40' 
                                                : 'bg-rose-50 dark:bg-rose-950/20 border-rose-250 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-950/40'
                                        }`}
                                        onClick={() => handleChangeUserStatus(user.id, user.enabled, user.email)}
                                    >
                                        {user.enabled ? 'Enabled' : 'Disabled'}
                                    </button>
                                </td>
                                <td className="px-4 py-3.5 text-xs">{formatDateTime(user.updatedAt)}</td>
                                <td className="px-4 py-3.5 text-xs">{formatDateTime(user.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TableUser