import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function RfpList() {
  const [rfps, setRfps] = useState([]);

  useEffect(() => {
    api.get("/rfps").then(res => setRfps(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All RFPs</h1>

      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Title</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rfps.map(rfp => (
              <tr key={rfp._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{rfp.title}</td>
                <td className="p-2">{new Date(rfp.createdAt).toLocaleDateString()}</td>
                <td className="p-2">
                  <Link
                    to={`/rfp/${rfp._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
