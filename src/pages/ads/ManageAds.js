import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AddAd from "./AddAd";

const ManageAds = () => {
    const [ads, setAds] = useState([]);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const response = await fetch("https://ryupunch.com/leafly/api/Admin/getallads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const result = await response.json();
            if (result.status) {

                setAds(result.data);
            }
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this ad?")) return;
        try {
            
            const response = await fetch("https://ryupunch.com/leafly/api/Admin/delete_ad", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({id: id})
            });

            const result = await response.json();
            if(result.status){

                setAds(ads.filter(ad => ad.id != id));
            }
        } catch (error) {
            console.error("Error deleting ad:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Manage Ads</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => { setAddFormOpen(true) }}
            >Add New</button>
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Small Heading</th>
                        <th className="p-2 border">Large Heading</th>
                        <th className="p-2 border">Link</th>
                        <th className="p-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {ads.map((ad) => (
                        <tr key={ad.id} className="border">
                            <td className="p-2 border">{ad.id}</td>
                            <td className="p-2 border">{ad.small_heading ?? ""}</td>
                            <td className="p-2 border">{ad.large_heading ?? ""}</td>
                            <td className="p-2 border">
                                <a href={ad.link} className="text-blue-500" target="_blank" rel="noopener noreferrer">{ad.link ?? ""}</a>
                            </td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleDelete(ad.id)}
                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {addFormOpen && (
                <AddAd onClose={() => { setAddFormOpen(false) }} onAdAdded={fetchAds} />
            )}
        </div>
    );
};

export default ManageAds;