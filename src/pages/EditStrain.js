import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash } from "lucide-react";
import $ from "jquery";
import "select2/dist/css/select2.css";
import "select2";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EditStrain = ({ strainId, onClose, finalfunction }) => {
  const [formData, setFormData] = useState({
    name: "",
    images: [],
    description: "",
    thc: "",
    cbg: "",
    dominant_terpene: "",
    price: "",
    feelings: [],
    negatives: [],
    helps_with: [],
  });

  const feelingsRef = useRef(null);
  const negativesRef = useRef(null);
  const helpsWithRef = useRef(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialImages, setInitialImages] = useState([]);

  useEffect(() => {
    if (strainId) {
      fetchStrainDetails();
    }

    const initializeSelect2 = () => {
        if (feelingsRef.current) {
          $(feelingsRef.current)
            .select2({ placeholder: "Select Feelings", multiple: true })
            .on("change", (e) => setFormData((prev) => ({ ...prev, feelings: $(e.target).val() || [] })));
        }
    
        if (negativesRef.current) {
          $(negativesRef.current)
            .select2({ placeholder: "Select Negative Effects", multiple: true })
            .on("change", (e) => setFormData((prev) => ({ ...prev, negatives: $(e.target).val() || [] })));
        }
    
        if (helpsWithRef.current) {
          $(helpsWithRef.current)
            .select2({ placeholder: "Select Benefits", multiple: true })
            .on("change", (e) => setFormData((prev) => ({ ...prev, helps_with: $(e.target).val() || [] })));
        }
      };
    
      setTimeout(initializeSelect2, 200);
    
      return () => {
        $(feelingsRef.current).select2("destroy");
        $(negativesRef.current).select2("destroy");
        $(helpsWithRef.current).select2("destroy");
      };
  }, [strainId]);

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
        const strain = result.data;
        setFormData({
          name: strain.name,
          images: JSON.parse(strain.images),
          description: strain.description,
          thc: strain.thc,
          cbg: strain.cbg,
          dominant_terpene: strain.dominant_terpene,
          price: strain.price,
          feelings: JSON.parse(strain.feelings),
          negatives: JSON.parse(strain.negatives),
          helps_with: JSON.parse(strain.helps_with),
        });
  
        setInitialImages(JSON.parse(strain.images));
  
        // Wait for state to update, then set select2 values
        setTimeout(() => {
          $(feelingsRef.current).val(JSON.parse(strain.feelings)).trigger("change");
          $(negativesRef.current).val(JSON.parse(strain.negatives)).trigger("change");
          $(helpsWithRef.current).val(JSON.parse(strain.helps_with)).trigger("change");
        }, 200);
      }
    } catch (error) {
      console.error("Error fetching strain details:", error);
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e, index) => {
    const files = [...formData.images];
    files[index] = e.target.files[0];
    setFormData({ ...formData, images: files });
  };

  const addFileInput = () => {
    setFormData({ ...formData, images: [...formData.images, null] });
  };

  const removeFileInput = (index) => {
    const files = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formDataToSend = new FormData();
    formDataToSend.append("id", strainId);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("thc", formData.thc);
    formDataToSend.append("cbg", formData.cbg);
    formDataToSend.append("dominant_terpene", formData.dominant_terpene);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("feelings", JSON.stringify(formData.feelings));
    formDataToSend.append("negatives", JSON.stringify(formData.negatives));
    formDataToSend.append("helps_with", JSON.stringify(formData.helps_with));
  
    // Separate old and new images
    const oldImages = initialImages.filter((img) => {
      // Keep the image if it's not replaced by a new file
      return formData.images.some((image) => image === img);
    });
  
    const newImages = formData.images.filter((img) => img instanceof File);
  
    // Append old images as JSON array
    formDataToSend.append("old_images", JSON.stringify(oldImages));
  
    // Append new images as files
    newImages.forEach((image) => {
      formDataToSend.append("images[]", image);
    });
  
    try {
      const response = await fetch("https://ryupunch.com/leafly/api/Product/update_product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formDataToSend,
      });
  
      const result = await response.json();
      if (result.status) {
        toast.success("Product updated successfully!");
        onClose();
        finalfunction();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 right-0 h-full w-full sm:w-2/3 lg:w-1/3 bg-white shadow-2xl z-49 overflow-y-auto p-6 rounded-l-3xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Strain</h2>
        <button onClick={onClose} className="p-1 rounded-full bg-gray-200 hover:bg-red-600 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Strain Name" className="input" value={formData.name} onChange={handleChange} required />

        <div className="space-y-2">
        <div className="space-y-2">
  {formData.images.map((image, index) => (
    <div key={index} className="flex items-center gap-2">
      {image instanceof File ? (
        <img
          src={URL.createObjectURL(image)}
          alt={`Preview ${index + 1}`}
          className="w-16 h-16 object-cover rounded-lg"
        />
      ) : (
        (image != null ? (
            <img
          src={`https://ryupunch.com/leafly/uploads/products/${image}`}
          alt={`Strain Image ${index + 1}`}
          className="w-16 h-16 object-cover rounded-lg"
        />
        ) : ( <p>Select Image</p>))
        
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, index)}
        className="hidden"
        id={`file-input-${index}`}
      />
      <label
        htmlFor={`file-input-${index}`}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 cursor-pointer"
      >
       {image == null ? "Upload" : "Change"} 
      </label>
      <button
        type="button"
        onClick={() => removeFileInput(index)}
        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
      >
        <Trash size={16} />
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={addFileInput}
    className="flex items-center gap-1 p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
  >
    <Plus size={16} /> Add Image
  </button>
</div>

        </div>

        <textarea name="description" placeholder="Description" className="input h-24" value={formData.description} onChange={handleChange} required></textarea>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="thc" placeholder="THC %" className="input" value={formData.thc} onChange={handleChange} required />
          <input type="number" name="cbg" placeholder="CBG %" className="input" value={formData.cbg} onChange={handleChange} required />
        </div>
        <input type="text" name="dominant_terpene" placeholder="Dominant Terpene" className="input" value={formData.dominant_terpene} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price per gram" className="input" value={formData.price} onChange={handleChange} required />
        <select ref={feelingsRef} name="feelings" className="input my-1 p-1" multiple required>
          <option value="Relaxed">Relaxed</option>
          <option value="Giggly">Giggly</option>
          <option value="Happy">Happy</option>
          <option value="Energetic">Energetic</option>
          <option value="Sleepy">Sleepy</option>
          <option value="Uplifted">Uplifted</option>
        </select>

        <select ref={negativesRef} name="negatives" className="input my-1 p-1" multiple required>
          <option value="Dry mouth">Dry mouth</option>
          <option value="Dry eyes">Dry eyes</option>
          <option value="Anxious">Anxious</option>
          <option value="Paranoid">Paranoid</option>
          <option value="Dizzy">Dizzy</option>
          <option value="Headache">Headache</option>
        </select>

        <select ref={helpsWithRef} name="helps_with" className="input my-1 p-1" multiple required>
          <option value="Stress">Stress</option>
          <option value="Anxiety">Anxiety</option>
          <option value="Depression">Depression</option>
          <option value="Pain">Pain</option>
          <option value="Insomnia">Insomnia</option>
          <option value="Lack of Appetite">Lack of Appetite</option>
        </select>

        <button type="submit" disabled={loading} className="w-full p-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:opacity-90">
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s ease-in-out;
        }
        .input:focus {
          border-color: #4caf50;
          box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
        }
      `}</style>
    </motion.div>
  );
};

export default EditStrain;