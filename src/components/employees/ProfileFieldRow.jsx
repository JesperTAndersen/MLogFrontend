import formStyles from "../../styles/forms.module.css";
import styles from "../../pages/UserProfile.module.css";

function ProfileFieldRow({ label, type, name, defaultValue, required }) {
  return (
    <div className={styles.row}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          className={`${formStyles.control} ${styles.inlineControl}`}
          required={required}
        />
      </div>
    </div>
  );
}

export default ProfileFieldRow;
