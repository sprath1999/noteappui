import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import NoteCard from "../components/NotesCard";
import { useCategories } from "../hooks/useCategories";
import "../styles/dashboard.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/noteservice";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data: categories = [], isLoading, isError } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  useEffect(() => {
    console.log(categories);

    if (categories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const { mutate: addCategory } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const handleSelectCategory = (id) => {
    setSelectedCategoryId(id);
  };

  const selectedNotes =
    categories.find((cat) => cat.id === selectedCategoryId)?.notes || [];

  const handleAddCategory = (name) => {
    addCategory(name);
  };

  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          onAddCategory={handleAddCategory}
        />

        <div style={{ flex: 1, padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2>Notes</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                className="add-note-btn"
                onClick={() =>
                  navigate("/add-note", {
                    state: { selectedCategoryId },
                  })
                }
              >
                + Add Note
              </button>
            </div>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Something went wrong while fetching categories.</p>
          ) : selectedNotes.length === 0 ? (
            <p>No notes in this category.</p>
          ) : (
            <div className="notes-grid">
              {selectedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  categoryId={selectedCategoryId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
