import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewNote, updateNote } from "../api/noteservice";

export default function AddNotePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEdit = location.state?.isEdit || false;
  const noteData = location.state?.noteData || {};
  const selectedCategoryId = location.state?.selectedCategoryId;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    console.log(noteData);
    console.log(selectedCategoryId);

    if (isEdit && noteData) {
      setTitle(noteData.title || "");
      setContent(noteData.content || "");
      setDocumentName(noteData.documentPath || "");
    }
  }, [isEdit, noteData]);

  const { mutate: createNote, isPending: adding } = useMutation({
    mutationFn: addNewNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/notes");
    },
  });

  const { mutate: editNote, isPending: updating } = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/notes");
    },
  });

  useEffect(() => {
    const fetchExistingFile = async () => {
      if (noteData?.documentPath && !file) {
        const url = `http://localhost:8080/files/${noteData.documentPath}`; // replace with your actual base URL
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = noteData.documentPath.split("_").pop();
        const fileFromUrl = new File([blob], filename, { type: blob.type });
        setFile(fileFromUrl);
      }
    };

    fetchExistingFile();
  }, [noteData]);

  const handleSubmit = (e) => {
    console.log(selectedCategoryId);

    e.preventDefault();

    if (!title || !content || (!file && !isEdit)) {
      return alert("All fields are required");
    }

    const formData = new FormData();
    console.log(selectedCategoryId);

    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", selectedCategoryId);
    if (file) {
      formData.append("document", file);
    }
    console.log(formData);

    if (isEdit) {
      editNote({ id: noteData.id, formData });
    } else {
      createNote(formData);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h2>{isEdit ? "Edit Note" : "Add New Note"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            height: "180px",
            padding: "8px",
            marginBottom: "10px",
            resize: "vertical",
          }}
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setDocumentName(e.target.files[0]?.name || "");
          }}
          style={{ marginBottom: "10px" }}
        />

        {isEdit && noteData?.documentPath && (
          <div
            style={{ marginBottom: "10px", fontStyle: "italic", color: "#555" }}
          >
            Attached Document: {noteData?.documentPath}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={adding || updating}>
            {adding || updating ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate("/notes")}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
