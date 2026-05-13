import styles from "./NavBar.module.css";

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
      <span
        className={styles.userAvatar}
        aria-label={userLabel}
        title={userLabel}
      >
        {userInitials}
      </span>
    </section>
  );
}

export default NavBar;
