import { useState } from "react";
import { api } from "../api";

export default function RfpForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState("");

  const submit = async () => {
    await api.post("/rfps", {
      title,
      description,
      questions: questions.split("\n"),
    });

    alert("RFP Created");
    setTitle("");
    setDescription("");
    setQuestions("");

    if (onCreated) onCreated();
  };

  return (
    <div>
      <h3>Create RFP</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <br />

      <textarea
        placeholder="Questions (one per line)"
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
      ></textarea>
      <br />

      <button onClick={submit}>Create</button>
    </div>
  );
}
