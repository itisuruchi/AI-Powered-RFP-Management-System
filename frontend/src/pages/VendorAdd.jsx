import VendorForm from "../components/VendorForm";
import { useNavigate } from "react-router-dom";

export default function VendorAdd() {
  const navigate = useNavigate();

  const handleAdded = () => {
    alert("Vendor added!");
    navigate("/vendors");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Vendor</h1>

      <div className="bg-white p-6 rounded shadow max-w-lg">
        <VendorForm onAdded={handleAdded} />
      </div>
    </div>
  );
}
