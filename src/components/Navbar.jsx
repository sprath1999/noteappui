import profileImg from "../assets/profile.png";
import "../styles/navbar.css";
export default function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">📝 Note Manager</div>

      <div className="search-bar">
        <input type="text" placeholder="Search notes..." />
      </div>

      <div className="profile-menu">
        <img src={profileImg} alt="profile" className="profile-img" />
        <div className="dropdown">
          <p>Change Password</p>
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
}
