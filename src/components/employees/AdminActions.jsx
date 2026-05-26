import { useState } from "react";
import Button from "../shared/Button";
import formStyles from "../../styles/forms.module.css";
import styles from "../../pages/UserProfile.module.css";
import {
  deactivateEmployee,
  reactivateEmployee,
} from "../../utils/employeeApi";

function AdminActions({ user, isVisible, onUserUpdated }) {
  const [confirming, setConfirming] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminActionError, setAdminActionError] = useState(null);

  function beginConfirm() {
    setAdminActionError(null);
    if (!isVisible) return;
    if (adminActionLoading) return;
    if (!user?.id) return;
    setConfirming(true);
  }

  function cancelConfirm() {
    if (adminActionLoading) return;
    setConfirming(false);
  }

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

      setConfirming(false);
    } catch (err) {
      setAdminActionError(err?.message ?? "Failed to update status");
    } finally {
      setAdminActionLoading(false);
    }
  }

  if (!isVisible) return null;

  const isActive = user?.active === true;
  const activeButtonText = isActive ? "Deactivate" : "Reactivate";

  return (
    <div className={styles.adminActions}>
      {adminActionError ? (
        <p className={`${formStyles.message} ${formStyles.error}`}>
          {adminActionError}
        </p>
      ) : null}

      {confirming ? (
        <>
          <p className={`${formStyles.message} center-text`}>Are you sure?</p>
          <Button
            handler={toggleActiveStatus}
            buttonText={
              adminActionLoading
                ? isActive
                  ? "Deactivating…"
                  : "Reactivating…"
                : "Yes"
            }
          />
          <Button type="button" handler={cancelConfirm} buttonText="Cancel" />
        </>
      ) : (
        <Button
          handler={beginConfirm}
          buttonText={
            adminActionLoading
              ? isActive
                ? "Deactivating…"
                : "Reactivating…"
              : `${activeButtonText} user`
          }
        />
      )}
    </div>
  );
}

export default AdminActions;
