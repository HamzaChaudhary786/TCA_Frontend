import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '../../../utils/Loader';
import { BACKEND_URL } from '../../../constants/api'; // Ensure this matches your API setup
import axios from 'axios';

const Dashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [months, setMonths] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            // Assuming we use the same axios instance or headers setup. 
            // If you have a custom axios instance, replace `axios` with it.
            // Using direct axios for now with localstorage token if needed, 
            // but let's assume standard fetch for now.
            const user = JSON.parse(localStorage.getItem("tcauser"));
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token || ""}` // Adjust based on your auth structure
                }
            };

            // Using relative URL if proxy is set or full URL
            const response = await axios.get(`${BACKEND_URL}/user/admins`, config);
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
            toast.error("Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleExtendSubscription = async (e) => {
        e.preventDefault();
        if (!selectedAdmin) return;
        setProcessing(true);
        try {
            const user = JSON.parse(localStorage.getItem("tcauser"));
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token || ""}`
                }
            };

            await axios.post(`${BACKEND_URL}/subscription/extend`, {
                userId: selectedAdmin.id,
                months: parseInt(months)
            }, config);

            toast.success(`Subscription extended for ${selectedAdmin.name}`);
            setIsModalOpen(false);
            fetchAdmins(); // Refresh list
        } catch (error) {
            console.error("Error extending subscription:", error);
            toast.error("Failed to extend subscription");
        } finally {
            setProcessing(false);
        }
    };

    const openModal = (admin) => {
        setSelectedAdmin(admin);
        setMonths(1);
        setIsModalOpen(true);
    };

    const checkStatus = (sub) => {
        if (!sub || !sub.expiresAt) return <span className="text-red-500 font-bold">Inactive</span>;
        const expiry = new Date(sub.expiresAt);
        const now = new Date();
        if (expiry > now) {
            return <span className="text-green-600 font-bold">Active</span>;
        } else {
            return <span className="text-red-500 font-bold">Expired</span>;
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;

    return (
        <div className="p-8 ml-80">
            <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Subscription Status
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Expires At
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {admin.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{admin.email}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {checkStatus(admin.subscription)}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {admin.subscription && admin.subscription.expiresAt ? new Date(admin.subscription.expiresAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            onClick={() => openModal(admin)}
                                            className="bg-[#0B1053] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Extend Subscription
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Extend Subscription</h2>
                        <p className="mb-4">Admin: <b>{selectedAdmin?.name}</b></p>
                        <form onSubmit={handleExtendSubscription}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Months to Add
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={months}
                                    onChange={(e) => setMonths(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#0B1053] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#0B1053] hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {processing ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
