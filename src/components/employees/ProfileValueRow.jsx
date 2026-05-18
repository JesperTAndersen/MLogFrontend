import styles from "../../pages/UserProfile.module.css";

function ProfileValueRow({ label, value }) {
  return (
    <div className={styles.row}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value || "—"}</div>
    </div>
  );
}

export default ProfileValueRow;
