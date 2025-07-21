import profileImg from "../assets/profile.png";
import notelogo from "../assets/notelogo.png";
import "../styles/navbar.css";
import { FaSearch, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";

export default function Navbar({ onToggleSidebar, onSearch }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo">
        <div className="hamburger" onClick={onToggleSidebar}>
          <FaBars />
        </div>
        {/* <img src={notelogo} alt="logo" className="note-logo" /> */}
        <span className="logo-text">Notera</span>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes..."
          name="search"
          value={searchInput}
          onChange={handleInputChange}
          className="inp_search"
        />
        <FaSearch
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6193ab",
          }}
        />
      </div>

      <div className="profile-menu">
        <img src={profileImg} alt="profile" className="profile-img" />
        <div className="dropdown">
          <p>Change Password(coming soon...)</p>
          <p onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
            Logout
          </p>
        </div>
      </div>
    </div>
  );
}
