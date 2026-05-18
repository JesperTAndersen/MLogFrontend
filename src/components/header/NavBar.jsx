import styles from "./NavBar.module.css";
import { Link } from "react-router";

function NavBar({ userInitials, userLabel, onToggle, pageTitle }) {
  return (
    <section className={styles.bar}>
      <span className={styles.toggle} onClick={onToggle}>
        ☰
      </span>
      <div className={styles.title}>
        <span className={styles.brand}>Rapid Maintenance</span>
        {pageTitle ? (
          <span className={styles.pageTitle}>{pageTitle}</span>
        ) : null}
      </div>
      <Link
        to="/employees/me"
        className={styles.userAvatar}
        aria-label={userLabel}
        title={userLabel}
      >
        {userInitials}
      </Link>
    </section>
  );
}

export default NavBar;
