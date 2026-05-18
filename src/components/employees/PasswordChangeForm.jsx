import { useState } from "react";
import InputField from "../shared/InputField";
import Button from "../shared/Button";
import formStyles from "../../styles/forms.module.css";
import styles from "../../pages/UserProfile.module.css";
import { changeEmployeePassword } from "../../utils/employeeApi";

function PasswordChangeForm({ employeeId, isVisible }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  async function handleChangePassword(e) {
    e?.preventDefault?.();
    setPasswordError(null);
    setPasswordMessage(null);

    if (changingPassword) return;
    if (!isVisible) return;
    if (!oldPassword) return setPasswordError("Old password is required.");
    if (!newPassword) return setPasswordError("New password is required.");
    if (newPassword !== confirmPassword) {
      return setPasswordError("New passwords do not match.");
    }
    if (!employeeId) {
      return setPasswordError("Missing authenticated user id.");
    }

    try {
      setChangingPassword(true);
      await changeEmployeePassword(employeeId, oldPassword, newPassword);
      setPasswordMessage("Password updated.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err?.message ?? "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  }

  if (!isVisible) return null;

  return (
    <section className={styles.password}>
      <p className={styles.passwordTitle}>Change password</p>

      <form className={styles.form} onSubmit={handleChangePassword}>
        <InputField
          label="Old password"
          type="password"
          value={oldPassword}
          onChange={setOldPassword}
          placeholder="********"
          required
        />

        <InputField
          label="New password"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="********"
          required
        />

        <InputField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="********"
          required
        />

        {passwordError ? (
          <p className={`${formStyles.message} ${formStyles.error}`}>
            {passwordError}
          </p>
        ) : null}

        {passwordMessage ? (
          <p className={`${formStyles.message} ${formStyles.success}`}>
            {passwordMessage}
          </p>
        ) : null}

        <Button buttonText={changingPassword ? "Updating…" : "Update password"} />
      </form>
    </section>
  );
}

export default PasswordChangeForm;
