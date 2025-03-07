import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, PhoneCall, Smile, ThumbsDown, ThumbsUp, X, XCircle } from "lucide-react";
import { ScaleLoader } from "react-spinners";
import ConfirmationModal from "../components/ConfirmationModal";
import Slider from "react-slick";


const StrainViewVerify = ({ strainId, onClose, finalFunction }) => {
    const [vendorDetails, setVendorDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                const response = await axios.post(
                    "https://ryupunch.com/leafly/api/Admin/get_strain_details",
                    { strainId },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                if (response.data.status) {
                    setVendorDetails(response.data.data);
                }

                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch vendor details");
                setLoading(false);
            }
        };

        fetchVendorDetails();
    }, [strainId, user]);

    const handleVerifyBtnClick = async () => {
        try {
            const response = await axios.post(
                "https://ryupunch.com/leafly/api/Admin/approve_strain",
                { strainId },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            if (response.data.status) {
                toast.success("Strain approved successfully!");
                onClose();
            }
        } catch (error) {
            toast.error("Failed to approve strain");
            console.error("Verification error:", error);
        } finally {
            finalFunction();
        }
    };



    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 bg-white h-full w-[85%] bg-gradient-to-br from-white to-gray-50 shadow-2xl z-50 overflow-y-auto rounded-l-xl"
        >
            <div className="relative p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Strain Details</h2>
                    <button
                        className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                        onClick={onClose}
                    >
                        <XCircle className="w-6 h-6 text-red-500" />
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <ScaleLoader color="#4F46E5" />
                    </div>
                )}
                <div className="flex w-full items-start justify-evenly">
                    <div className="w-1/2">
                        {vendorDetails && (
                            <>
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-green-100">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3 sm:mb-0">
                                        {vendorDetails.name}
                                    </h2>
                                </div>

                                <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                                    {/* Image Carousel */}
                                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                                        <div className="max-w-[260px] sm:max-w-full mx-auto bg-gray-50 p-4 rounded-lg shadow-inner">
                                            <div className="flex overflow-x-auto space-x-4 p-0.5 scrollbar-hide">
                                                {JSON.parse(vendorDetails.images).map((img, index) => (
                                                    <motion.div
                                                        key={index}
                                                        className="flex-shrink-0 px-2"
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <img
                                                            src={`https://ryupunch.com/leafly/uploads/products/${img}`}
                                                            alt={vendorDetails.name}
                                                            className="w-auto max-h-[150px] sm:max-h-[150px] object-contain rounded-md shadow-md"
                                                            onError={(e) =>
                                                                (e.target.src = "https://placehold.co/300x200?text=No+Image")
                                                            }
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>

                                    {/* Description Section */}
                                    <div className="w-full md:w-1/2">
                                        <div className="mb-5 grid grid-cols-2 flex-wrap gap-2 items-center">
                                            <span className="inline-flex items-center justify-center px-4 py-2 bg-teal-100 text-green-600 font-medium rounded-full shadow-sm">
                                                {vendorDetails.dominant_terpene}
                                            </span>

                                            <span className="inline-flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-800 font-medium rounded-full shadow-sm">
                                                <span className="font-bold mr-1">THC</span> {vendorDetails.thc}%
                                            </span>

                                            <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full shadow-sm">
                                                <span className="font-bold mr-1">CBG</span> {vendorDetails.cbg}%
                                            </span>

                                            <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full shadow-sm">
                                                <span className="font-bold mr-1">Price</span> {vendorDetails.price}
                                            </span>
                                        </div>




                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600 shadow-sm">
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        {vendorDetails.description}
                                    </p>
                                </div>

                                {/* Effects & Benefits */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm sm:text-base">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-100"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <Smile size={20} className="text-green-600" />
                                            </div>
                                            <h3 className="font-bold text-green-800">Feelings</h3>
                                        </div>
                                        <p className="text-gray-700 break-words">
                                            {JSON.parse(vendorDetails.feelings).join(", ")}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <ThumbsUp size={20} className="text-blue-600" />
                                            </div>
                                            <h3 className="font-bold text-blue-800">Helps With</h3>
                                        </div>
                                        <p className="text-gray-700 break-words">
                                            {JSON.parse(vendorDetails.helps_with).join(", ")}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-red-50 rounded-lg p-4 shadow-sm border border-red-100"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-red-100 p-2 rounded-full">
                                                <ThumbsDown size={20} className="text-red-600" />
                                            </div>
                                            <h3 className="font-bold text-red-800">Negatives</h3>
                                        </div>
                                        <p className="text-gray-700 break-words">
                                            {JSON.parse(vendorDetails.negatives).join(", ")}
                                        </p>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </div>
                    {vendorDetails && (
                        <div className="space-y-6">
                            {/* Company Info Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-indigo-600 mb-4">Store Information</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">Store Name</span>
                                        <span className="text-base font-medium text-gray-900">{vendorDetails.company_name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">Location</span>
                                        <span className="text-base font-medium text-gray-900">{vendorDetails.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-indigo-600 mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                                            <Mail className="text-blue-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Email</span>
                                            <span className="text-base font-medium text-gray-900">{vendorDetails.email_id}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                                            <PhoneCall className="text-blue-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Phone</span>
                                            <span className="text-base font-medium text-gray-900">{vendorDetails.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Email Verified
                                </span>

                                <div className="mt-4">
                                    <button
                                        onClick={() => { setIsModalOpen(true) }}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Approve Strain
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <ConfirmationModal
                    isOpen={isModalOpen}
                    message="Are you sure you want approve?"
                    smallMessage="Strain will be approved and displayed to all."
                    onConfirm={handleVerifyBtnClick}
                    onCancel={() => setIsModalOpen(false)}
                />
            </div>
        </motion.div>
    );
};

export default StrainViewVerify;