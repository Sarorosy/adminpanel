import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Hourglass, CheckCircle, Leaf, User, Cannabis } from "lucide-react";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        pending_vendors: 0,
        approved_vendors: 0,
        pending_strains: 0,
        approved_strains: 0,
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await fetch("https://ryupunch.com/leafly/api/Admin/get_dashboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const result = await response.json();
            if (result.status) {
                setDashboardData(result.data);
            } else {
                toast.error(result.message || "Failed to fetch dashboard data");
            }
        } catch (error) {
            toast.error("Error fetching dashboard data");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vendor Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pending Vendors */}
                    <div className="bg-yellow-100 p-6 rounded-lg shadow-md flex items-center gap-4">
                        <div className="bg-yellow-500 text-white p-3 rounded-full">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Pending Vendors</h3>
                            <p className="text-4xl font-bold text-gray-900">{dashboardData.pending_vendors}</p>
                        </div>
                    </div>

                    {/* Approved Vendors */}
                    <div className="bg-green-100 p-6 rounded-lg shadow-md flex items-center gap-4">
                        <div className="bg-green-500 text-white p-3 rounded-full">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Approved Vendors</h3>
                            <p className="text-4xl font-bold text-gray-900">{dashboardData.approved_vendors}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strain Section */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Strain Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pending Strains */}
                    <div className="bg-yellow-100 p-6 rounded-lg shadow-md flex items-center gap-4">
                        <div className="bg-yellow-500 text-white p-3 rounded-full">
                            <Cannabis className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Pending Strains</h3>
                            <p className="text-4xl font-bold text-gray-900">{dashboardData.pending_strains}</p>
                        </div>
                    </div>

                    {/* Approved Strains */}
                    <div className="bg-green-100 p-6 rounded-lg shadow-md flex items-center gap-4">
                        <div className="bg-green-500 text-white p-3 rounded-full">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Approved Strains</h3>
                            <p className="text-4xl font-bold text-gray-900">{dashboardData.approved_strains}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
