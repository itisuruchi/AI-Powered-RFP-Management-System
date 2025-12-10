import { Routes, Route, Link } from "react-router-dom";
import RfpList from "./pages/RfpList";
import RfpCreate from "./pages/RfpCreate";
import RfpDetail from "./pages/RfpDetail";
import VendorList from "./pages/VendorList";
import VendorAdd from "./pages/VendorAdd";


export default function App() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">AI RFP System</h2>

        <nav className="space-y-4">
          <Link className="block text-gray-700 hover:font-semibold" to="/">RFP List</Link>
          <Link className="block text-gray-700 hover:font-semibold" to="/create">Create RFP</Link>
          <Link className="block text-gray-700 hover:font-semibold" to="/vendors">Vendors</Link>
          <Link className="block text-gray-700 hover:font-semibold" to="/vendors/add">Add Vendor</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<RfpList />} />
          <Route path="/create" element={<RfpCreate />} />
          <Route path="/rfp/:id" element={<RfpDetail />} />
          <Route path="/vendors" element={<VendorList />} />
          <Route path="/vendors/add" element={<VendorAdd />} />
        </Routes>
      </main>

    </div>
  );
}
