const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function askGroq(prompt) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    response_format: { type: "json_object" }   
  });

  return completion.choices[0].message.content;
}

exports.parseRfpFromText = async (text) => {
  const prompt = `
Extract the following from the RFP text and return ONLY JSON (no explanations):

{
  "title": "",
  "budget": "",
  "neededBy": "",
  "paymentTerms": "",
  "warranty": "",
  "items": []
}

RFP Text:
${text}
`;

  try {
    const jsonText = await askGroq(prompt);
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("🔥 AI JSON parse error (RFP):", err);
    return {
      title: "Untitled RFP",
      budget: null,
      neededBy: null,
      paymentTerms: null,
      warranty: null,
      items: []
    };
  }
};

exports.parseProposalFromEmail = async (emailText) => {
  const prompt = `
Extract vendor proposal details and return ONLY JSON (strict format):

{
  "price": "",
  "delivery_time": "",
  "warranty": "",
  "features": [],
  "notes": ""
}

Email:
${emailText}
`;

  try {
    const jsonText = await askGroq(prompt);
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("🔥 AI JSON parse error (proposal):", err);
    return {};
  }
};

exports.scoreProposal = async (proposalObj) => {
  const prompt = `
Score the vendor proposal (1–100).

Return ONLY JSON:
{
  "score": 0,
  "analysis": ""
}

Proposal:
${JSON.stringify(proposalObj, null, 2)}
`;

  try {
    const jsonText = await askGroq(prompt);
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("🔥 AI JSON parse error (score):", err);
    return { score: 50, analysis: "Fallback: AI failed to parse." };
  }
};
