import { useState } from "react";
import { api } from "../api";

export default function VendorForm({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/vendors", {
      name,
      email,
      contactName,
      phone
    });

    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Vendor Name</label>
        <input
          className="w-full p-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Email</label>
        <input
          className="w-full p-2 border rounded"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Contact Person</label>
        <input
          className="w-full p-2 border rounded"
          value={contactName}
          onChange={e => setContactName(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Phone</label>
        <input
          className="w-full p-2 border rounded"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Vendor
      </button>
    </form>
  );
}



