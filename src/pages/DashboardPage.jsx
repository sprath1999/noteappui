import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import NoteCard from "../components/NotesCard";
import { useCategories } from "../hooks/useCategories";
import "../styles/dashboard.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategoryById,
  searchNotesInCategory,
} from "../api/noteservice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { data: categories = [], isLoading, isError } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
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

  const { mutate: deleteCategory } = useMutation({
    mutationFn: deleteCategoryById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setSelectedCategoryId(null);
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      const selectedNotes =
        categories.find((cat) => cat.id === selectedCategoryId)?.notes || [];
      setFilteredNotes(selectedNotes);
    }
  }, [searchTerm, categories, selectedCategoryId]);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim() === "") return;

    try {
      const res = await searchNotesInCategory(term, selectedCategoryId);
      setFilteredNotes(res);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleSelectCategory = (id) => {
    setSelectedCategoryId(id);
  };

  const handleAddCategory = (name) => {
    addCategory(name);
  };

  const handleDeleteCategory = (id) => {
    deleteCategory(id);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearch={handleSearch}
      />
      <div className="dashboard-content">
        <Sidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          isOpen={sidebarOpen}
        />

        <div>
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
          ) : filteredNotes.length === 0 ? (
            <p>No notes found in this category.</p>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
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
