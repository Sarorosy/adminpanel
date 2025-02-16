import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";

const EditProfile = ({ onClose }) => {
    const [formData, setFormData] = useState({
        storeName: "",
        description: "",
        phone: "",
        address: "",
        gstNumber: "",
        license: null,
        idProof: null,
        storeImage: null,
        bannerImage: null,
    });
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);

    const fetchStoreDetails = async () => {
        try {
            setLoading(true)
            const response = await fetch("https://ryupunch.com/leafly/api/Vendor/get_vendor_details", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            if (result.status) {
                setFormData({
                    storeName: result.data.company_name || "",
                    description: result.data.description || "",
                    phone: result.data.phone || "",
                    address: result.data.location || "",
                    gstNumber: result.data.gst_number || "",
                    license: result.data.store_license || null,
                    idProof: result.data.id_proof || null,
                    storeImage: result.data.profile || null,
                    bannerImage: result.data.banner || null
                });
            } else {
                console.error("Failed to fetch vendor details:", result.message);
            }
        } catch (error) {
            console.error("Error fetching vendor details:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchStoreDetails();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("company_name", formData.storeName);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("location", formData.address);
        formDataToSend.append("gst_number", formData.gstNumber);

        if (formData.license) formDataToSend.append("store_license", formData.license);
        if (formData.idProof) formDataToSend.append("id_proof", formData.idProof);
        if (formData.storeImage) formDataToSend.append("profile", formData.storeImage);
        if (formData.bannerImage) formDataToSend.append("banner", formData.bannerImage);

        try {
            setLoading(true);
            const response = await fetch("https://ryupunch.com/leafly/api/Vendor/edit_vendor_details", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`, // Token for authentication
                    // Do NOT set 'Content-Type': 'multipart/form-data' manually. The browser will set it automatically.
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (result.status) {
                toast.success("Profile updated successfully!");
                onClose(); // Close modal on success
                const updatedUser = { ...user, ...result.data };
                login({ ...user, ...result.data });
                login(updatedUser);
            } else {
                console.error("Failed to update profile:", result.message);
                toast.error("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
            console.log(user)
        }
    };


    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto p-6 rounded-l-xl"
        >
            {/* Close Button */}
            <button disabled={loading} onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <X className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center justify-center">
                <h2 className="text-3xl font-bold text-green-700 text-center ">Edit Store Profile</h2>
                {loading && (
                    <div className="flex items-center ml-2">
                        <FadeLoader
                            height={5}
                            speedMultiplier={2}
                            width={5}
                        />
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Store Name</label>
                    <input type="text" name="storeName" className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600" onChange={handleChange} value={formData.storeName} required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <input type="text" name="phone" className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600" onChange={handleChange} value={formData.phone} required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Store Description</label>
                    <textarea name="description" className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600" onChange={handleChange} value={formData.description} required></textarea>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Address</label>
                    <textarea name="address" className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600" onChange={handleChange} value={formData.address} required></textarea>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">GST Number</label>
                    <input type="text" name="gstNumber" className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600" onChange={handleChange} value={formData.gstNumber} required />
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-2 gap-6">
                    <FileUpload label="Store License (PDF)" name="license" file={formData.license} onChange={handleFileChange} />
                    <FileUpload label="ID Proof (PDF/Image)" name="idProof" file={formData.idProof} onChange={handleFileChange} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <FileUpload label="Store Image" name="storeImage" file={formData.storeImage} onChange={handleFileChange} />
                    <FileUpload label="Banner Image" name="bannerImage" file={formData.bannerImage} onChange={handleFileChange} />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button disabled={loading} type="submit" className="bg-green-700 text-white py-2 px-6 rounded-lg text-sm font-semibold hover:bg-green-800 transition-all duration-300 shadow-md">
                        Save Profile
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

// File Upload Component
const FileUpload = ({ label, name, file, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        {file && (typeof file === "string" ? (
            <div className="mb-2">
                <a href={"https://ryupunch.com/leafly/uploads/vendors/" + file} target="_blank" rel="noopener noreferrer" className="text-blue-600 bg-blue-100 p-1 rounded" style={{ fontSize: "10px" }}>
                    {file}
                </a>
            </div>
        ) : (
            file instanceof File && (
                <div className="mb-2 text-sm text-gray-600">{file.name}</div>
            )
        ))}

        <div className="relative flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
            <span className="text-sm text-gray-600">{file ? (typeof file === "string" ? "Change file" : file.name) : "No file chosen"}</span>
            <input type="file" name={name} className="absolute inset-0 opacity-0 cursor-pointer" onChange={onChange} />
        </div>
    </div>
);


export default EditProfile;
