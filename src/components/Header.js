import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, CircleUserRound, LogOut, User } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="bg-white  border-b-2 border-green-700  shadow-md px-4 py-2 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-green-800">Welcome Administrator</h1>

      {/* User Profile Section */}
      <div className="relative">
        <button 
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <CircleUserRound />
          <span>{user?.name}</span>
          <ChevronDown size={18} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="w-full text-left px-4 py-2 text-red-500 flex items-center gap-2 hover:bg-red-100 rounded-lg"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to log out?"
        smallMessage="You will be redirected to the login page."
        onConfirm={logout}
        onCancel={() => setIsModalOpen(false)}
      />
    </header>
  );
};

export default Header;
