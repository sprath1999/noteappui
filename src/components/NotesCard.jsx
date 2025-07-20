import { useQueryClient } from "@tanstack/react-query";
import { deleteNoteById } from "../api/noteservice";
import "../styles/notecard.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function NoteCard({ note, categoryId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;

    try {
      await deleteNoteById(note.id);
      alert("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // if (onDelete) onDelete(note.id); // optional callback to parent
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note");
    }
  };

  const handleEdit = () => {
    console.log(categoryId);

    navigate("/add-note", {
      state: { isEdit: true, noteData: note, selectedCategoryId: categoryId },
    });
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h4 className="note-title">{note.title}</h4>
        <div className="note-icons">
          <span
            title="View"
            className="note-action-icon"
            onClick={() => navigate(`/notes/${note.id}`)}
          >
            <FaEye style={{ color: "669acf", cursor: "pointer" }} />
          </span>
          <span title="Edit" className="note-action-icon" onClick={handleEdit}>
            <FaEdit style={{ color: "93af93", cursor: "pointer" }} />
          </span>
          <span
            title="Delete"
            className="note-action-icon"
            onClick={handleDelete}
          >
            <FaTrash style={{ color: "c95e5e", cursor: "pointer" }} />
          </span>
        </div>
      </div>
      <p className="note-content">{note.content.slice(0, 80)}...</p>
      <div className="note-date">
        {new Date(note.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
