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
        <div className="container mx-auto p-4 bg-[#ffffff] shadow-md">
            <div className='flex justify-between rounded-md items-center bg-gray-200 py-2 px-4 '>
                <div className='flex flex-col'>
                    <h1 className="text-2xl font-bold">All Users</h1>
                    <span className='text-sm'>Current logged in user: {CurrentUser.email}</span>
                </div>
                <p className=''><span>{useCurrentTime()}</span></p>
            </div>
            <table className="w-full border mt-2">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border">No</th>
                        <th className="border">Name</th>
                        <th className="border">Email</th>
                        <th className="border">Role</th>
                        <th className="border">Status</th>
                        <th className="border">Updated At</th>
                        <th className="border">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index} className="text-center">
                            <td className="border">{index + 1}</td>
                            <td className="border">{user.name}</td>
                            <td className="border">{user.email}</td>

                            <td className="border">
                                <select
                                    className={`h-8 w-20 m-1 p-1 text-white rounded-md transition duration-200 shadow-md cursor-pointer ${user.role === 'admin' ? 'bg-purple-400 hover:bg-purple-500' : 'bg-blue-400 hover:bg-blue-500'}`}
                                    onChange={(e) => handleChangeUserRole(user.id, e.target.value, user.email)}
                                    value={user.role}
                                >
                                    <option className='bg-purple-400 hover:bg-purple-500' value="admin">Admin</option>
                                    <option className='bg-blue-400 hover:bg-blue-500' value="user">User</option>
                                </select>
                            </td>

                            <td className="border">
                                <button
                                    className={`h-8 w-20 m-1 text-white rounded-md transition duration-200 shadow-md ${user.enabled ? 'bg-green-400 hover:bg-green-500' : 'bg-red-400 hover:bg-red-500'}`}
                                    onClick={() => handleChangeUserStatus(user.id, user.enabled, user.email)}
                                >
                                    {user.enabled ? 'Enable' : 'Disable'}
                                </button>
                            </td>
                            <td className="border">{formatDateTime(user.updatedAt)}</td>
                            <td className="border ">
                                {formatDateTime(user.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableUser