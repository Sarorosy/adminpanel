import { useState, useEffect,useRef } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash } from "lucide-react";
import "select2/dist/css/select2.css";
import "select2";
import $ from "jquery";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AddProduct = ({ onClose , finalfunction}) => {
  const [formData, setFormData] = useState({
    name: "",
    images: [null], // Start with one file input
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

  useEffect(() => {
    $(feelingsRef.current)
      .select2({ placeholder: "Select Feelings", multiple: true })
      .on("change", (e) => 
        setFormData((prev) => ({ ...prev, feelings: $(e.target).val() || [] }))
      );
  
    $(negativesRef.current)
      .select2({ placeholder: "Select Negative Effects", multiple: true })
      .on("change", (e) => 
        setFormData((prev) => ({ ...prev, negatives: $(e.target).val() || [] }))
      );
  
    $(helpsWithRef.current)
      .select2({ placeholder: "Select Benefits", multiple: true })
      .on("change", (e) => 
        setFormData((prev) => ({ ...prev, helps_with: $(e.target).val() || [] }))
      );
  
    return () => {
      $(feelingsRef.current).select2("destroy");
      $(negativesRef.current).select2("destroy");
      $(helpsWithRef.current).select2("destroy");
    };
  }, []);
  

  // Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleImageUpload = (e, index) => {
    const files = [...formData.images];
    files[index] = e.target.files[0]; // Store single file per input
    setFormData({ ...formData, images: files });
  };

  // Add a new file input
  const addFileInput = () => {
    setFormData({ ...formData, images: [...formData.images, null] });
  };

  // Remove a file input
  const removeFileInput = (index) => {
    const files = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: files });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure all file inputs are filled
    if (formData.images.some(img => !img)) {
        alert("Please upload all files before submitting.");
        return;
    }

    // Create FormData object for file uploads
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("thc", formData.thc);
    formDataToSend.append("cbg", formData.cbg);
    formDataToSend.append("dominant_terpene", formData.dominant_terpene);
    formDataToSend.append("price", formData.price);

    // Append arrays as JSON strings (since FormData doesn't support arrays natively)
    formDataToSend.append("feelings", JSON.stringify(formData.feelings));
    formDataToSend.append("negatives", JSON.stringify(formData.negatives));
    formDataToSend.append("helps_with", JSON.stringify(formData.helps_with));

    // Append images one by one
    formData.images.forEach((image, index) => {
        formDataToSend.append(`images[]`, image); // Backend should accept 'images[]'
    });

    try {
        const response = await fetch("https://ryupunch.com/leafly/api/Product/add_product", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`, // Send Bearer token
            },
            body: formDataToSend, // Send FormData
        });

        const result = await response.json();

        if (result.status) {
            toast.success("Product added successfully!");
            onClose();
            console.log("API Response:", result);
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Something went wrong. Please try again.");
    }finally{
      setLoading(false);
      finalfunction();
    }
};


  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 right-0 h-full w-full sm:w-2/3 lg:w-1/3 bg-white shadow-2xl z-50 overflow-y-auto p-6  rounded-l-3xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Strain</h2>
        <button onClick={onClose} className="p-1 rounded-full bg-gray-200 hover:bg-red-600 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Strain Name" className="input" onChange={handleChange} required />

        {/* Dynamic File Inputs */}
        <div className="space-y-2">
          {formData.images.map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, index)}
                className="input"
                required
              />
              {formData.images.length > 1 && index != 0 && (
                <button
                  type="button"
                  onClick={() => removeFileInput(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
                >
                  <Trash size={16} />
                </button>
              )}
              {index == 0 && (
                <button
                type="button"
                onClick={addFileInput}
                className="flex items-center gap-1 p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
              >
                <Plus size={16} /> 
              </button>
              )}
            </div>
          ))}
          
        </div>

        <textarea name="description" placeholder="Description" className="input h-24" onChange={handleChange} required></textarea>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="thc" placeholder="THC %" className="input" onChange={handleChange} required />
          <input type="number" name="cbg" placeholder="CBG %" className="input" onChange={handleChange} required />
        </div>
        <input type="text" name="dominant_terpene" placeholder="Dominant Terpene" className="input" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price per gram" className="input" onChange={handleChange} required />
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
        <button type="submit" disabled={loading} onClick={handleSubmit} className="w-full p-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:opacity-90">
          Submit
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

export default AddProduct;
