import { useState } from "react";
import { CheckCircle, MapPin, Edit, BadgeCheck } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import EditProfile from "./EditProfile";
import { useAuth } from "../context/AuthContext";

const StoreProfile = () => {
    const [EditPageOpen, setEditPageOpen] = useState(false);
    const {user} = useAuth();

  const [storeData, setStoreData] = useState({
    banner: null,
    storeImage: null,
    storeName: "Awesome Store",
    address: "123 Main St, Anytown, AN 12345",
    isVerified: true,
    description:
      "Welcome to Awesome Store! We specialize in providing high-quality products and exceptional customer service. Visit us today for an amazing shopping experience.",
  });
  const handleEditClick = () =>{
    setEditPageOpen(true);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border rounded-lg overflow-hidden shadow-lg">
        {/* Store Banner */}
        <div className="relative h-48 md:h-48 bg-gray-300">
          {user.banner ? (
            <img
              src={"https://ryupunch.com/leafly/uploads/vendors/" + user.banner}
              alt="Store Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Store Banner
            </div>
          )}
        </div>

        <div className="relative pt-16 pb-8 px-4 md:px-6 bg-white">
          {/* Store Profile Image */}
          <div className="absolute -top-16 left-4 md:left-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
              {user.profile ? (
                <img
                  src={"https://ryupunch.com/leafly/uploads/vendors/" + user.profile}
                  alt="Store Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Store Image
                </div>
              )}
            </div>
          </div>

          {/* Store Details */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center mb-2 md:mb-0">
              <h1 className="text-3xl font-bold mr-2">{user.company_name}</h1>
              {user.status == 1 && <BadgeCheck className="w-6 h-6 text-green-800 rounded-full bg-green-100" />}
            </div>
            <button onClick={handleEditClick} className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          {/* Store Address */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            <p>{user.location}</p>
          </div>

          {/* Store Description */}
          <p className="text-gray-600">{user.description}</p>
        </div>
      </div>
      <AnimatePresence>
        {EditPageOpen && (
            <EditProfile onClose={()=>{setEditPageOpen(false)}}/>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreProfile;
