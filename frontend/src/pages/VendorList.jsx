import { useState, useEffect } from "react";
import { api } from "../api";

export default function VendorList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/vendors").then(res => setList(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendors</h1>

      <div className="bg-white p-4 rounded shadow">
        {list.map(v => (
          <div key={v._id} className="border-b p-2">
            <div className="font-semibold">{v.name}</div>
            <div className="text-gray-600">{v.email}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

