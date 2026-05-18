import { useState } from "react";
import Button from "../shared/Button";
import formStyles from "../../styles/forms.module.css";
import styles from "../../pages/UserProfile.module.css";
import {
  deactivateEmployee,
  reactivateEmployee,
} from "../../utils/employeeApi";

function AdminActions({ user, isVisible, onUserUpdated }) {
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminActionError, setAdminActionError] = useState(null);

  async function toggleActiveStatus() {
    setAdminActionError(null);

    if (!isVisible) return;
    if (adminActionLoading) return;
    if (!user?.id) return;

    try {
      setAdminActionLoading(true);
      if (user.active) {
        await deactivateEmployee(user.id);
        onUserUpdated?.({ ...user, active: false });
      } else {
        await reactivateEmployee(user.id);
        onUserUpdated?.({ ...user, active: true });
      }
    } catch (err) {
      setAdminActionError(err?.message ?? "Failed to update status");
    } finally {
      setAdminActionLoading(false);
    }
  }

  if (!isVisible) return null;

  return (
    <div className={styles.adminActions}>
      {adminActionError ? (
        <p className={`${formStyles.message} ${formStyles.error}`}>
          {adminActionError}
        </p>
      ) : null}

      <Button
        handler={toggleActiveStatus}
        buttonText={
          adminActionLoading
            ? user.active
              ? "Deactivating…"
              : "Reactivating…"
            : user.active
              ? "Deactivate user"
              : "Reactivate user"
        }
      />
    </div>
  );
}

export default AdminActions;
