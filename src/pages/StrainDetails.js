import { useEffect, useState } from "react";
import { HeartHandshake, Smile, ThumbsDown, ThumbsUp, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const StrainDetails = ({ strainId, onClose }) => {
    const [strain, setStrain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    useEffect(() => {
        const fetchStrainDetails = async () => {
            try {
                const response = await fetch(
                    "https://ryupunch.com/leafly/api/Product/get_strain_details/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.token}`,
                        },
                        body: JSON.stringify({ id: strainId }),
                    }
                );

                const result = await response.json();
                if (result.status) {
                    setStrain(result.data);
                } else {
                    setError(result.message || "Failed to fetch strain details");
                }
            } catch (error) {
                setError("Error fetching strain details");
            } finally {
                setLoading(false);
            }
        };

        if (strainId) {
            fetchStrainDetails();
        }
    }, [strainId, user.token]);

    if (!strainId) return null;

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto p-6"
        >
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton height={30} width="80%" />
                        <div className=" space-x-1 animate-pulse grid grid-cols-2">
                            <Skeleton height={200}  />
                            <Skeleton height={200}  />
                        </div>
                        
                        <div className=" space-x-1 animate-pulse grid grid-cols-2">
                        <Skeleton height={35}  />
                        <Skeleton height={35}  />
                        <Skeleton height={35}  />
                        <Skeleton height={35}  />
                            </div>
                        

                        <Skeleton height={20} width="50%" className="mt-3"/>
                        <Skeleton height={20} width="60%" />
                        <Skeleton height={20} width="50%" />
                        <Skeleton height={20} width="60%" />

                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center font-medium">{error}</p>
                ) : (
                    <div className="text-gray-800">
                        <h2 className="text-3xl font-semibold text-center mb-4">{strain.name}</h2>
                        <div className="flex w-full max-w-full space-x-2 mb-3">
                            {/* Image Carousel (50%) */}
                            <div className="w-1/2 overflow-hidden">
                                <Slider {...sliderSettings} className="w-full">
                                    {JSON.parse(strain.images).map((img, index) => (
                                        <div key={index} className="w-full flex justify-center">
                                            <img
                                                src={`https://ryupunch.com/leafly/uploads/products/${img}`}
                                                alt={strain.name}
                                                className="w-auto h-60 object-cover rounded-lg shadow-md"
                                                onError={(e) =>
                                                    (e.target.src = "https://placehold.co/300x200?text=No+Image")
                                                }
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>

                            {/* Description (50%) */}
                            <div className="w-1/2 flex items-center">
                                <p className="text-sm text-gray-600">{strain.description}</p>
                            </div>
                        </div>





                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><span className="font-semibold">THC:</span> {strain.thc}%</p>
                            <p><span className="font-semibold">CBG:</span> {strain.cbg}%</p>
                            <p><span className="font-semibold">Category:</span> {strain.dominant_terpene}</p>
                            <p><span className="font-semibold">Price:</span> ${strain.price}</p>
                        </div>

                        <div className="mt-4 space-y-2">
                            <p className="font-semibold flex items-center space-x-1"> <Smile size={15} className="mr-5"/> Feelings: <span className="text-gray-600">{JSON.parse(strain.feelings).join(", ")}</span></p>
                            <p className="font-semibold flex items-center space-x-1"> <ThumbsUp size={15} className="mr-5"/> Helps With: <span className="text-gray-600">{JSON.parse(strain.helps_with).join(", ")}</span></p>
                            <p className="font-semibold flex items-center space-x-1"> <ThumbsDown size={15} className="mr-5"/> Negatives: <span className="text-gray-600">{JSON.parse(strain.negatives).join(", ")}</span></p>
                        </div>

                        <div className="mt-4">
                            <p className="font-semibold">Stock Status:</p>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1 ${strain.stock === "1" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                                    }`}
                            >
                                {strain.stock === "1" ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StrainDetails;