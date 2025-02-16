import { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net";
import { Plus, Eye, Edit, Trash2, RefreshCcw } from "lucide-react";
import $ from "jquery";
import AddProduct from "./AddProduct";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import StrainDetails from "./StrainDetails";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import EditStrain from "./EditStrain";
import ViewVerify from "./ViewVerify";
import StoreProfileForUser from "./StoreProfileForUser";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [detailsTabOpen, setDetailsTabOpen] = useState(false);
  const [editTabOpen, setEditTabOpen] = useState(false);
  const [verifyTabOpen, setVerifyTabOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const { user } = useAuth();

  DataTable.use(DT);

  const fetchVendors = async () => {
    setLoading(true);
    try {
        const response = await fetch("https://ryupunch.com/leafly/api/Admin/list_vendors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });

        const result = await response.json();

        if (result.status) {
            setVendors(result.data);
            setApprovedVendors(result.data.filter((vendor) => vendor.is_verified == 1));
            setPendingVendors(result.data.filter((vendor) => vendor.is_verified == 0));
        } else {
            toast.error(result.message || "Failed to fetch vendors");
        }
    } catch (error) {
        toast.error("Error fetching vendors");
    } finally {
        setLoading(false);
    }
};

const fetchApprovedVendors = async () => {
  setLoading(true);
  try {
      const response = await fetch("https://ryupunch.com/leafly/api/Admin/list_vendors", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
          },
      });

      const result = await response.json();

      if (result.status) {
          setVendors(result.data);
          setApprovedVendors(result.data.filter((vendor) => vendor.is_verified == 1));
          setPendingVendors(result.data.filter((vendor) => vendor.is_verified == 0));
      } else {
          toast.error(result.message || "Failed to fetch vendors");
      }
  } catch (error) {
      toast.error("Error fetching vendors");
  } finally {
      setLoading(false);
  }
};

  useEffect(() => {


    fetchVendors();
  }, [user.token]);

  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock == 1 ? 0 : 1; // Toggle stock status

    try {
      const response = await axios.post(
        "https://ryupunch.com/leafly/api/Product/update_strain_stock",
        { strain_id: id, stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        setVendors((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, stock: newStock } : product
          )
        );
        toast.success("Stock status updated!");
      } else {
        toast.error("Failed to update stock status!");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Something went wrong!");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus == 1 ? 0 : 1;
    console.log("iddddd"+ id)

    try {
      const response = await axios.post(
        "https://ryupunch.com/leafly/api/Admin/update_vendor_status",
        { vendor_id: id, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        setVendors((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, status: newStatus } : product
          )
        );
        setApprovedVendors((prev) =>
          prev.map((product) =>
            product.id == id ? { ...product, status: newStatus } : product
          )
        );
        toast.success("Status updated!");
      } else {
        toast.error("Failed to update strain!");
      }
    } catch (error) {
      console.error("Error updating strain:", error);
      toast.error("Something went wrong!");
    }
  };


  const handleView = (id) => {
    setSelectedId(id);
    setDetailsTabOpen(true);
  };

  const handleVerify = (id) => {
    setSelectedId(id);
    setVerifyTabOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setVendors((prev) => prev.filter((product) => product.id !== id));
      toast.error("Product deleted!");
    }
  };

  const pendingColumns = [
    {
      title: "Image",
      data: "profile",
      render: (data) => {
        const imageUrl = data ? `https://ryupunch.com/leafly/uploads/vendors/${data}` : 'https://placehold.co/50x50?text=No+Image';
        return `<img src='${imageUrl}' class='w-12 h-12 rounded-lg' onerror="this.onerror=null;this.src='https://placehold.co/50x50?text=No+Image';"/>`;
      },
    },
    { title: "Name", data: "company_name", render: (data) => (data && data.trim() !== "" ? data : "N/A") },
    { title: "Email", data: "email_id" },
    { title: "Phone", data: "phone" },
    {
      title: "Verified",
      data: null,
      render: (data, type, row) => {
        let displayText = row.is_verified == 1 ? "Verified" : "Not Verified";
        let bgColor = row.is_verified == 1 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";

        return `<button class='verify-btn px-3 py-1 rounded-full text-sm font-medium ${bgColor}' data-id="${row.id}">${displayText}</button>`;
      },
    },
    {
      title: "Actions",
      data: null,
      render: (data, type, row) => {
        return `
          <div class="flex gap-2">
            <button class="view-verify-btn bg-green-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-green-600 transition" data-id="${row.id}">View & Verify</button>
            <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600 transition" data-id="${row.id}">Delete</button>
          </div>
        `;
      },
    },
  ];

  const approvedColumns = [
    {
      title: "Image",
      data: "profile",
      render: (data) => {
        const imageUrl = data ? `https://ryupunch.com/leafly/uploads/vendors/${data}` : 'https://placehold.co/50x50?text=No+Image';
        return `<img src='${imageUrl}' class='w-12 h-12 rounded-lg' onerror="this.onerror=null;this.src='https://placehold.co/50x50?text=No+Image';"/>`;
      },
    },
    { title: "Name", data: "company_name", render: (data) => (data && data.trim() !== "" ? data : "N/A") },
    { title: "Email", data: "email_id" },
    { title: "Phone", data: "phone" },
    {
      title: "Status",
      data: null,
      render: (data, type, row) => {
        let displayText = row.status == 0 ? "Inactive" : row.status == 1 ? "Active" : "Inactive";
        let bgColor = row.status == 0 ? "bg-yellow-200 text-yellow-800" : row.status == 1 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";

        return `<button class='status-btn px-3 py-1 rounded-full text-sm font-medium ${bgColor}' data-id="${row.id}">${displayText}</button>`;
      },
    },
    {
      title: "Actions",
      data: null,
      render: (data, type, row) => {
        return `
          <div class="flex gap-2">
            <button class="view-btn bg-blue-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-600 transition" data-id="${row.id}">View</button>
            <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600 transition" data-id="${row.id}">Delete</button>
          </div>
        `;
      },
    },
  ];

  const handleActiveBtnClick = () =>{
    setActiveTab("Approved");
    fetchApprovedVendors();
  }
const pendingTabBtnClick = () => {
  setActiveTab("Pending");
  fetchVendors();
}


  return (
    <div className="px-3 py-3 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white rounded px-2 py-2">
        <h1 className="text-2xl font-semibold">Vendors</h1>
      </div>

      <div className="flex mb-4">
      <button
            
            onClick={handleActiveBtnClick}
            className={`px-3 py-1 rounded-lg ${activeTab === "Approved" ? "bg-green-800 text-white" : "bg-gray-300 text-gray-800"
              } mx-1`}
          >
            Approved
          </button>
          <button
            
            onClick={pendingTabBtnClick}
            className={`px-3 py-1 rounded-lg ${activeTab === "Pending" ? "bg-green-800 text-white" : "bg-gray-300 text-gray-800"
              } mx-1`}
          >
            Pending
          </button>
        <button onClick={fetchVendors} className={` bg-gray-200 text-gray-700 px-2 py-1 rounded-xl`} >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton width={50} height={50} />
                <Skeleton width={250} />
                <Skeleton width={80} />
                <Skeleton width={100} />
                <Skeleton width={100} />
                <Skeleton width={100} />
                <Skeleton width={100} />
              </div>
            ))}
          </div>
        ) : (
           activeTab == "Pending" ? (<DataTable
            data={pendingVendors}
            columns={pendingColumns}
            options={{
              pageLength: 10,
              ordering: true,
              createdRow: (row, data) => {
                $(row).find(".view-verify-btn").on("click", () => handleVerify(data.id));
                $(row).find(".view-btn").on("click", () => handleView(data.id));
                $(row).find(".delete-btn").on("click", () => handleDelete(data.id));
              },
            }}
          />) : (

            <DataTable
              data={approvedVendors}
              columns={approvedColumns}
              options={{
                pageLength: 10,
                ordering: true,
                createdRow: (row, data) => {
                 $(row).find(".status-btn").on("click", () => toggleStatus(data.id, data.status));
                  $(row).find(".view-btn").on("click", () => handleView(data.id));
                  $(row).find(".delete-btn").on("click", () => handleDelete(data.id));
                },
              }}
            />)


        )}
      </div>
      <AnimatePresence>
        {addFormOpen && <AddProduct onClose={() => setAddFormOpen(false)} finalfunction={fetchVendors} />}

        {detailsTabOpen && (
          <StoreProfileForUser storeId={selectedId} onClose={() => { setDetailsTabOpen(false) }} />
        )}
        {editTabOpen && (
          <EditStrain strainId={selectedId} onClose={() => { setEditTabOpen(false) }} finalfunction={fetchVendors} />
        )}
        {verifyTabOpen && (
          <ViewVerify vendorId={selectedId} onClose={() => { setVerifyTabOpen(false) }} finalFunction={fetchVendors}  />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorsPage;
