import "./NavBar.css";

function NavBar({ username, onToggle, pageTitle }) {
  return (
    <section className="nav-bar">
      <span className="nav-bar-toggle" onClick={onToggle}>
        ☰
      </span>
      <div className="nav-bar-title">
        <span className="nav-bar-brand">Rapid Maintenance</span>
        {pageTitle ? (
          <span className="nav-bar-page-title">{pageTitle}</span>
        ) : null}
      </div>
      <span className="nav-bar-user">{username}</span>
    </section>
  );
}

export default NavBar;
