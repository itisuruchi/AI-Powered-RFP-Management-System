import { useState } from "react";
import { api } from "../api";

export default function RfpCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [aiParsed, setAiParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const parseWithAI = async () => {
    if (!description) {
      alert("Enter description text first");
      return;
    }

    setLoading(true);
    setAiParsed(null);

    try {
      const res = await api.post("/rfps", {
        text: description,
      });

      setAiParsed(res.data);
    } catch (err) {
      alert("AI parsing failed");
    }

    setLoading(false);
  };

  const saveRfp = async () => {
    setSaving(true);

    try {
      const res = await api.post("/rfps", {
        title,
        description
      });

      alert("RFP Created!");
    } catch (err) {
      alert("Error saving RFP");
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Create RFP</h1>

      <div>
        <label className="block text-gray-700 font-medium">RFP Title</label>
        <input
          className="border p-2 w-full rounded mt-1"
          placeholder="Enter RFP Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">RFP Description (plain text)</label>
        <textarea
          className="border p-2 w-full rounded mt-1 h-40"
          placeholder="Paste full RFP text here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        onClick={parseWithAI}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded shadow disabled:bg-gray-400"
      >
        {loading ? "AI Parsing..." : "Use AI to Parse RFP"}
      </button>

      {aiParsed && (
        <div className="bg-blue-50 p-4 rounded border mt-4">
          <h3 className="text-xl font-semibold mb-2">AI Parsed Output</h3>

          <p><strong>Title:</strong> {aiParsed.title || "--"}</p>
          <p><strong>Budget:</strong> {aiParsed.parsed?.budget || "--"}</p>
          <p><strong>Delivery:</strong> {aiParsed.parsed?.neededBy || "--"}</p>
          <p><strong>Warranty:</strong> {aiParsed.parsed?.warranty || "--"}</p>

          <h4 className="font-semibold mt-3">Items:</h4>
          <pre className="bg-white p-3 border rounded text-sm">
            {JSON.stringify(aiParsed.parsed?.items || [], null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={saveRfp}
        disabled={saving}
        className="bg-green-600 text-white px-4 py-2 rounded shadow disabled:bg-gray-400"
      >
        {saving ? "Saving..." : "Save RFP"}
      </button>
    </div>
  );
}
