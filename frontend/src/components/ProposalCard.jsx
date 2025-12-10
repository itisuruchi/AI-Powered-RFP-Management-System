export default function ProposalCard({ proposal }) {
  const vendorName = proposal.vendor?.name || "Unknown Vendor";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
      }}
    >
      <h4>{vendorName}</h4>
      <p><strong>Score:</strong> {proposal.score || "Not scored"}</p>

      <h5>Extracted Details</h5>
      <pre style={{ background: "#f5f5f5", padding: 10, borderRadius: 5 }}>
        {JSON.stringify(proposal.parsed, null, 2)}
      </pre>
    </div>
  );
}
