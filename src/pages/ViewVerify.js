import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, PhoneCall, X, XCircle } from "lucide-react";
import { ScaleLoader } from "react-spinners";
import ConfirmationModal from "../components/ConfirmationModal";


const ViewVerify = ( { vendorId, onClose, finalFunction }) => {
  const [vendorDetails, setVendorDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.post(
          "https://ryupunch.com/leafly/api/Admin/get_vendor_details",
          { vendorId },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if(response.data.status){
            setVendorDetails(response.data.data);
        }
        
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch vendor details");
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendorId, user]);

  const handleVerifyBtnClick = async () => {
    try {
      const response = await axios.post(
        "https://ryupunch.com/leafly/api/Admin/verify_vendor",
        { vendorId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      if (response.data.status) {
        toast.success("Vendor verified successfully!");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to verify vendor");
      console.error("Verification error:", error);
    }finally{
        finalFunction();
    }
  };

  

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 right-0 bg-white h-full w-full sm:w-2/3 lg:w-1/3 bg-gradient-to-br from-white to-gray-50 shadow-2xl z-50 overflow-y-auto rounded-l-xl"
    >
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Vendor Details</h2>
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
                    <Mail className="text-blue-400"/>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-base font-medium text-gray-900">{vendorDetails.email_id}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                    <PhoneCall className="text-blue-400"/>
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
                  onClick={()=> {setIsModalOpen(true)}}
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
                  Verify Vendor
                </button>
              </div>
            </div>
          </div>
        )}
        <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want verify?"
        smallMessage="vendor will be verified and able to login."
        onConfirm={handleVerifyBtnClick}
        onCancel={() => setIsModalOpen(false)}
      />
      </div>
    </motion.div>
  );
};

export default ViewVerify;