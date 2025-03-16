import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const ImportVendors = ({ excelData, onClose, after }) => {

    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [posting, setPosting] = useState(false);

    const handleSendData = async () => {
        if (excelData.length === 0) {
            alert("No data to send!");
            return;
        }

        const formattedData = excelData.map((row) => ({
            company_name: row["Name"] || "",
            location: `${row["Address 1"] || ""} ${row["Address 2"] || ""} ${row["City"] || ""} ${row["Country"] || ""}`.trim(),
            latitude: row["Latitude"] || "",
            longitude: row["Longitude"] || "",
            phone: row["Phone"] || "",
            email_id: row["Email"] || "",
            website: row["Website"] || "",
            delivery: row["Delivery"] || "False",
        }));

        console.log("Formatted Data:", formattedData);

        setPosting(true);
        try {
            const response = await fetch("https://ryupunch.com/leafly/api/Admin/import_vendors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(formattedData)
            });

            const data = await response.json();
            console.log("Response:", data);

            if (data.status) {
                toast.success("Data sent successfully!");
            } else {
                toast.error(data.message || "Failed to send data!");
            }

            if (data.skipped && data.skipped.length > 0) {
                const skippedDetails = data.skipped.map(item =>
                    `<strong>${item.company_name}</strong>: ${item.reason}`
                ).join("<br />");
                setError(skippedDetails);
            } else {
                setError(null); // Clear error if no skipped vendors
            }

            if(data.status && !data.skipped){
                after();
            }

        } catch (error) {
            console.error("Error sending data:", error);
            toast.error("An error occurred while sending data!");
        } finally {
            setPosting(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-3/4 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto rounded-l-xl p-6 border border-gray-200"
        >
            {/* Close Button */}
            <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-xl font-semibold text-gray-700">Import Vendors</h2>
                <button
                    onClick={onClose}
                    disabled={posting}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-200"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto mt-4">
                {excelData.length > 0 && !error && (
                    <table className="w-full border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                            <tr>
                                {Object.keys(excelData[0]).map((key) => (
                                    <th key={key} className="border border-gray-300 p-3 text-left">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                >
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx} className="border p-3">{value || "--"}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {error && (
                    <>
                    <h3 className="text-center mb-2">These imports are skipped. Because</h3>
                    <p className="text-gray-500 bg-orange-200 px-2 py-2 text-center text-orange-800 font-semibold"
                        dangerouslySetInnerHTML={{ __html: error }}>
                    </p>
                    </>
                )}

            </div>

            {!error ? (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSendData}
                        disabled={posting}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Send Data
                    </button>
                </div>
            ) : null}

        </motion.div>
    );
};

export default ImportVendors;
