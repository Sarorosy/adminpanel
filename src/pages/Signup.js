import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const Signup = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    company: "",
    phone: "",
    location: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    const payload = {
      email_id : formData.email,
      password : formData.password,
      company_name : formData.company,
      phone : formData.phone,
      location : formData.location
    }
    try {
        const response = await axios.post("https://ryupunch.com/leafly/api/Auth/signup", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.data.status) {
            toast.success(`OTP sent to ${formData.email}`);
            setStep(2);
        } else {
            toast.error(response.data.message || "Signup failed!");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed! Try again.");
    } finally {
        setLoading(false);
    }
};


const handleOtpVerification = async () => {
  setLoading(true);

  try {
      const response = await axios.post("https://ryupunch.com/leafly/api/Auth/verify_otp", {
          email_id: formData.email,
          otp: otp,
      });

      if (response.data.status) {
          toast.success(response.data.message);
          
        
          navigate("/signin");
      } else {
          toast.error(response.data.message || "OTP verification failed!");
      }
  } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
  } finally {
      setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Vendor Signup</h2>
        {step === 1 ? (
          <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
            <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
            <button type="submit" disabled={!isFormValid}  className={`${!isFormValid ? 'green-btn-disabled cursor-not-allowed' : 'green-btn'} w-full py-3 text-white font-medium rounded-lg `}>Sign Up</button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-700">Enter the OTP sent to {formData.email}</p>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" required />
            <button onClick={handleOtpVerification} className="w-full py-3 text-white font-medium rounded-lg green-btn">Verify OTP</button>
          </div>
        )}
        <p className="text-center mt-4">Already have an account? <Link to="/signin" className="green-text hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Signup;
