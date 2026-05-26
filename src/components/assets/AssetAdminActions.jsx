import { useState } from "react";
import Button from "../shared/Button";
import formStyles from "../../styles/forms.module.css";
import profileStyles from "../../pages/UserProfile.module.css";
import { deactivateAsset, reactivateAsset } from "../../utils/assetApi";

function AssetAdminActions({ asset, isVisible, onAssetUpdated }) {
  const [confirming, setConfirming] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminActionError, setAdminActionError] = useState(null);

  function beginConfirm() {
    setAdminActionError(null);
    if (!isVisible) return;
    if (adminActionLoading) return;
    if (!asset?.id) return;
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
    if (!asset?.id) return;

    try {
      setAdminActionLoading(true);
      if (asset.active) {
        await deactivateAsset(asset.id);
        onAssetUpdated?.({ ...asset, active: false });
      } else {
        await reactivateAsset(asset.id);
        onAssetUpdated?.({ ...asset, active: true });
      }

      setConfirming(false);
    } catch (err) {
      setAdminActionError(err?.message ?? "Failed to update asset status");
    } finally {
      setAdminActionLoading(false);
    }
  }

  if (!isVisible) return null;

  const isActive = asset?.active === true;
  const activeButtonText = isActive ? "Deactivate" : "Reactivate";

  return (
    <div className={profileStyles.adminActions}>
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
          <Button handler={cancelConfirm} buttonText="Cancel" />
        </>
      ) : (
        <Button
          handler={beginConfirm}
          buttonText={
            adminActionLoading
              ? isActive
                ? "Deactivating…"
                : "Reactivating…"
              : `${activeButtonText} asset`
          }
        />
      )}
    </div>
  );
}

export default AssetAdminActions;
