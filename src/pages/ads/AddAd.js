import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AddAd = ({ onClose, onAdAdded }) => {
  const [formData, setFormData] = useState({
    small_heading: "",
    large_heading: "",
    link: "",
    button_text: "",
    background_image: null,
  });
  const {user} = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, background_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "https://ryupunch.com/leafly/api/Admin/add_ad/",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${user.token}`, } }
      );
      
      if (response.data.status) {
        toast.success("Ad added successfully!");
        onAdAdded();
        onClose();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding ad:", error);
      toast.error("Failed to add ad. Please try again.");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Ad</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="small_heading"
            placeholder="Small Heading"
            value={formData.small_heading}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 border rounded"
          />
          <input
            type="text"
            name="large_heading"
            placeholder="Large Heading"
            value={formData.large_heading}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 border rounded"
          />
          <input
            type="url"
            name="link"
            placeholder="Ad Link"
            value={formData.link}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 border rounded"
          />
          <input
            type="text"
            name="button_text"
            placeholder="Button Text"
            value={formData.button_text}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 border rounded"
          />
          <input
            type="file"
            name="background_image"
            onChange={handleFileChange}
            required
            className="w-full p-2 mb-3 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Ad
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddAd;
