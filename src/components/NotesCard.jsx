import { useQueryClient } from "@tanstack/react-query";
import { deleteNoteById } from "../api/noteservice";
import "../styles/notecard.css";
import { useNavigate } from "react-router-dom";

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
          <span title="View" onClick={() => navigate(`/notes/${note.id}`)}>
            👁️
          </span>
          <span title="Edit" onClick={handleEdit}>
            ✏️
          </span>
          <span title="Delete" onClick={handleDelete}>
            🗑️
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
