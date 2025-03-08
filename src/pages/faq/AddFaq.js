import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { X } from "lucide-react";


const AddFaq = ({ onClose, finalfunction }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
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



    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                "https://ryupunch.com/leafly/api/Admin/add_faq",
                { content: question },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            if (response.data.status) {
                toast.success(response.data.message)
                setQuestion(response.data.data);
            } else {
                toast.error(response.data.message);
            }

            setLoading(false);
        } catch (error) {
            toast.error("Failed to Update Terms!");
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-[90%] bg-white shadow-2xl z-50 overflow-y-auto p-6 rounded-l-3xl"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add FAQ</h2>
                <button onClick={onClose} className="p-1 rounded-full bg-gray-200 hover:bg-red-600 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Question Input */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Question</label>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Type Question"
                ></textarea>
            </div>

            {/* Answer Input */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Answer</label>
                <ReactQuill
                    value={answer}
                    onChange={setAnswer}
                    modules={modules}
                    className="border rounded-lg"
                    placeholder="Type Answer"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
                Submit
            </button>
        </motion.div>

    );
};

export default AddFaq;
