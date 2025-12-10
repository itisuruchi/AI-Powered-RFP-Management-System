import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function RfpDetail() {
  const { id } = useParams();

  const [rfp, setRfp] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [sending, setSending] = useState(false);

  const [selectedVendorForProposal, setSelectedVendorForProposal] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [parsedItems, setParsedItems] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");

  const [scoringIds, setScoringIds] = useState([]);

  useEffect(() => {
    api.get(`/rfps/${id}`).then((res) => setRfp(res.data));
    api.get("/vendors").then((res) => setVendors(res.data));
    api.get(`/proposals/byRfp/${id}`).then((res) => setProposals(res.data));
  }, [id]);

  const toggleVendor = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const sendEmail = async () => {
    if (selectedVendors.length === 0) {
      alert("Please select at least one vendor.");
      return;
    }
    setSending(true);
    await api.post(`/rfps/${id}/send`, { vendorIds: selectedVendors });
    setSending(false);
    alert("Emails sent!");
  };

  // Score a proposal using AI
  const scoreProposal = async (proposalId) => {
    setScoringIds((prev) => [...prev, proposalId]);
    const res = await api.post(`/proposals/score/${proposalId}`);
    const updated = res.data;
    setProposals((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
    setScoringIds((prev) => prev.filter((id) => id !== proposalId));
  };

  const createProposal = async (e) => {
    e.preventDefault();
    if (!selectedVendorForProposal) {
      alert("Please select a vendor for the proposal.");
      return;
    }

    const body = {
      rfp: rfp._id,
      vendor: selectedVendorForProposal,
      rawEmail: { subject: emailSubject, body: emailBody },
      parsed: {
        items: parsedItems.split(",").map((i) => i.trim()),
        quantity,
        budget,
      },
    };

    const res = await api.post("/proposals", body);
    setProposals((prev) => [...prev, res.data]);

    setSelectedVendorForProposal("");
    setEmailSubject("");
    setEmailBody("");
    setParsedItems("");
    setQuantity("");
    setBudget("");
  };

  if (!rfp) return <p className="text-gray-600">Loading…</p>;

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{rfp.title}</h1>
        <button
          onClick={sendEmail}
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
        >
          {sending ? "Sending..." : "Send RFP Email"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{rfp.description}</p>
      </div>

      {rfp.parsed && (
        <div className="bg-blue-50 p-4 rounded-md shadow">
          <h3 className="font-semibold mb-2 text-lg">AI Parsed Details</h3>
          <p><strong>Items:</strong> {rfp.parsed.items?.join(", ") || "--"}</p>
          <p><strong>Quantity:</strong> {rfp.parsed.quantity || "--"}</p>
          <p><strong>Budget:</strong> {rfp.parsed.budget || "--"}</p>
          <p><strong>Delivery Time:</strong> {rfp.parsed.delivery_time || "--"}</p>
          <p><strong>Warranty:</strong> {rfp.parsed.warranty || "--"}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Select Vendors</h2>
        <div className="space-y-2 max-h-44 overflow-y-auto border rounded-lg p-3">
          {vendors.map((vendor) => (
            <label
              key={vendor._id}
              className="flex items-center space-x-3 p-2 border-b hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor._id)}
                onChange={() => toggleVendor(vendor._id)}
                className="w-4 h-4"
              />
              <div>
                <p className="font-medium">{vendor.name}</p>
                <p className="text-gray-600 text-sm">{vendor.email}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create Proposal</h2>
        <form onSubmit={createProposal} className="space-y-2">
          <select
            value={selectedVendorForProposal}
            onChange={(e) => setSelectedVendorForProposal(e.target.value)}
            className="border p-1 rounded w-full"
          >
            <option value="">Select Vendor</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>{v.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Email Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            className="border p-1 rounded w-full"
          />
          <textarea
            placeholder="Email Body"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            className="border p-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="Parsed Items (comma separated)"
            value={parsedItems}
            onChange={(e) => setParsedItems(e.target.value)}
            className="border p-1 rounded w-full"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-1 rounded w-full"
          />
          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border p-1 rounded w-full"
          />

          <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded mt-2">
            Create Proposal
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Proposals</h2>
        {proposals.length === 0 ? (
          <p className="text-gray-500">No proposals received yet.</p>
        ) : (
          <div className="space-y-4">
            {proposals.map((p) => (
              <div key={p._id} className="border p-4 rounded bg-gray-50 shadow-sm">
                <h3 className="font-semibold">{p.vendor?.name}</h3>
                <p className="text-sm text-gray-600">{p.vendor?.email}</p>

                {p.score ? (
                  <p className="mt-2 text-green-700 font-bold">
                     AI Score: {p.score}/100
                  </p>
                ) : (
                  <button
                    onClick={() => scoreProposal(p._id)}
                    disabled={scoringIds.includes(p._id)}
                    className="mt-2 bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    {scoringIds.includes(p._id) ? "Scoring..." : "Run AI Scoring"}
                  </button>
                )}

                {p.analysis && (
                  <p className="mt-2 text-gray-700 italic">
                     {p.analysis}
                  </p>
                )}

                <pre className="mt-3 bg-white p-3 rounded border text-sm overflow-x-auto">
                  {JSON.stringify(p.parsed, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
