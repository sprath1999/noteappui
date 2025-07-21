import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";
import ProtectedRoute from "./components/protectedRoute";

import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import AddNotePage from "./pages/AddNotePage";
import ViewNotePage from "./pages/ViewNotePage";
import "./global.css";
function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-note"
        element={
          <ProtectedRoute>
            <AddNotePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <ProtectedRoute>
            <ViewNotePage />
          </ProtectedRoute>
        }
      />

      {/* Optional: fallback route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
