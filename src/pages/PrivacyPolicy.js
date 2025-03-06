import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const PrivacyPolicy = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
    const {user} = useAuth();
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get(
          "https://ryupunch.com/leafly/api/Admin/get_privacypolicy",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.data.status) {
          setValue(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch Terms of Use!");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [user.token]);

  
  const handleSubmit = async () => {
    try {
        const response = await axios.post(
          "https://ryupunch.com/leafly/api/Admin/update_privacy_policy",
          { content : value },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if(response.data.status){
            toast.success(response.data.message)
            setValue(response.data.data);
        }else{
            toast.error(response.data.message);
        }
        
        setLoading(false);
      } catch (error) {
        toast.error("Failed to Update Terms!");
        setLoading(false);
      }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Privacy Policy</h2>
      <ReactQuill
        value={value}
        onChange={setValue}
        modules={modules}
        className="mb-4 border rounded-lg"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
      >
        Submit
      </button>
    </div>
  );
};

export default PrivacyPolicy;
