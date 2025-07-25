import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewNote, updateNote } from "../api/noteservice";
import { useMemo } from "react";
import "../styles/addnewpage.css";
export default function AddNotePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEdit = location.state?.isEdit || false;
  // const noteData = location.state?.noteData || {};

  const noteData = useMemo(
    () => location.state?.noteData || {},
    [location.state?.noteData]
  );
  const selectedCategoryId = location.state?.selectedCategoryId;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    if (isEdit && noteData) {
      setTitle(noteData.title || "");
      setContent(noteData.content.trim() || "");
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
        const url = `http://localhost:8080/files/${noteData.documentPath}`;
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = noteData.documentPath.split("_").pop();
        const fileFromUrl = new File([blob], filename, { type: blob.type });
        setFile(fileFromUrl);
      }
    };

    fetchExistingFile();
  }, [noteData, file]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content) {
      return alert("All fields are required");
    }

    const formData = new FormData();

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
    <div className="add-note-container">
      <h2>{isEdit ? "Edit Note" : "Add New Note"}</h2>
      <form className="add-note-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/* <div style={{ marginBottom: "10px" }}>
          <i>Document Upload feature Coming Soon.......</i>
        </div> */}

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setDocumentName(e.target.files[0]?.name || "");
          }}
        />

        {isEdit && noteData?.documentPath && (
          <div className="attached-document">
            Attached Document: {documentName}
          </div>
        )}

        <div className="button-group">
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
