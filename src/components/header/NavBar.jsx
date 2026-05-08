import "./NavBar.css";

function NavBar({ username, onToggle }) {
  return (
    <section className="nav-bar">
      <span className="nav-bar-toggle" onClick={onToggle}>
        ☰
      </span>
      <span className="nav-bar-title">Rapid Maintenance</span>
      <span className="nav-bar-user">{username}</span>
    </section>
  );
}

export default NavBar;
