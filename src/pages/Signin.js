import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login"); // "login" or "otp"
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const isFormValid = Object.values(formData).every((value) => value.trim() !== "");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://ryupunch.com/leafly/api/Admin/login", {
        email_id: formData.email,
        password: formData.password,
      });

      if (res.data.status) {
        toast.success(res.data.message || "Login successful, OTP sent!");
        setStep("otp");
      } else {
        toast.error(res.data.message || "Signin failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signin failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://ryupunch.com/leafly/api/Admin/verify_otp", {
        email_id: formData.email,
        otp: formData.otp,
      });

      if (res.data.status) {
        toast.success("OTP verified successfully!");
        login(res.data.admin_data);
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Invalid OTP!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Administrator Login</h2>
        {step === "login" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white flex items-center justify-center font-medium rounded-lg transition-all ${ !loading ? "green-btn" : "green-btn-disabled cursor-not-allowed"
              }`}>
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="flex gap-2 justify-center">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  value={formData.otp[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^[0-9]*$/.test(value)) return;
                    
                    const newOtp = formData.otp.split('');
                    newOtp[index] = value;
                    handleChange({
                      target: {
                        name: 'otp',
                        value: newOtp.join('')
                      }
                    });

                    // Auto-focus next input
                    if (value && index < 5) {
                      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
                      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
                      prevInput?.focus();
                    }
                  }}
                  maxLength={1}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl"
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white flex items-center justify-center font-medium rounded-lg transition-all ${isFormValid && !loading ? "green-btn" : "green-btn-disabled cursor-not-allowed"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signin;
