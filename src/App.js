import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders"; // Create an Orders page
import VendorLayout from "./layout/VendorLayout";
import './output.css';
import './style.css';
import StoreProfile from "./pages/StoreProfile";
import VendorsMap from "./pages/VendorsMap";
import VendorsPage from "./pages/VendorsPage";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import StrainsPage from "./pages/StrainsPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user ? children : <Navigate to="/signin" />;
};


const App = () => {
  return (
    <AuthProvider>
      <Router basename="siteadmin">
        <Toaster position="top-center" />
        <Routes>
          <Route path="/signin" element={<Signin />} />

          {/* Vendor Layout with Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<StoreProfile />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="strains" element={<StrainsPage />} />
            <Route path="map" element={<VendorsMap />} />
            <Route path="terms-of-use" element={<TermsOfUse />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
