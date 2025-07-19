// src/pages/ViewNotePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../api/noteservice";
import axios from "axios";

export default function ViewNotePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !note) return <p>Note not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ⬅ Back
      </button>

      <h1>{note.title}</h1>
      <p style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
        {note.content}
      </p>

      <a
        href={`http://localhost:8080/files/${note.documentPath}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📄 View Document
      </a>
    </div>
  );
}
