import { useState } from "react";
import "../styles/sidebar.css";

export default function Sidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory, // ✅ New prop
}) {
  const [showForm, setShowForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName("");
    setShowForm(false);
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Categories</h3>
      <ul className="category-list">
        {categories.map((category) => (
          <li
            key={category.id}
            style={{
              fontWeight:
                selectedCategoryId === category.id ? "bold" : "normal",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "6px",
              backgroundColor:
                selectedCategoryId === category.id ? "#dfefff" : "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span onClick={() => onSelectCategory(category.id)}>
              {category.name}
            </span>
            <button
              onClick={() => onDeleteCategory(category.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
                fontSize: "16px",
              }}
              title="Delete Category"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {!showForm && (
        <button className="add-category-btn" onClick={() => setShowForm(true)}>
          + Add Category
        </button>
      )}

      {showForm && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Category name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            style={{ width: "100%", padding: "6px", marginBottom: "6px" }}
          />
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={handleAdd}>Save</button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewCatName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
