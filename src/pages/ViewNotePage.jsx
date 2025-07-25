import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../api/noteservice";
import "../styles/viewnotepage.css";
import { MdNote } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";

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
    <div className="view-note-container">
      <button className="view-note-back" onClick={() => navigate(-1)}>
        <FiArrowLeft size={20} />
        Back
      </button>

      <h1 className="view-note-title">{note.title}</h1>

      <p className="view-note-content">{note.content}</p>

      {note.documentPath && (
        <a
          className="view-note-link"
          href={`http://localhost:8080/files/${note.documentPath}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <MdNote size={20} />
            <span>View Document</span>
          </div>
        </a>
      )}
    </div>
  );
}
