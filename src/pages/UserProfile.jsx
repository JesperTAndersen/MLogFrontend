import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useParams } from "react-router";
import { getEmployeeById, getMe } from "../utils/employeeApi";
import EditProfileForm from "../components/employees/EditProfileForm";
import AdminActions from "../components/employees/AdminActions";
import PasswordChangeForm from "../components/employees/PasswordChangeForm";
import Button from "../components/shared/Button";
import assetDetailStyles from "./AssetDetail.module.css";
import styles from "./UserProfile.module.css";
import FeedbackMessage from "../components/shared/FeedbackMessage";

const ROLE_BADGE_CLASS = {
  ADMIN: styles.roleADMIN,
  MANAGER: styles.roleMANAGER,
  TECHNICIAN: styles.roleTECHNICIAN,
  AUTHENTICATED: styles.roleAUTHENTICATED,
};

function UserProfile() {
  const { id } = useParams();
  const { authUser, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const isOwnProfile = !id || id === String(authUser?.id);
  const canManageEmployees = hasRole?.("MANAGER") === true;
  const canAdminEmployees = hasRole?.("ADMIN") === true;

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        setIsEditing(false);

        const data = isOwnProfile ? await getMe() : await getEmployeeById(id);
        if (!ignore) setUser(data);
      } catch (err) {
        if (!ignore) setError(err?.message ?? "Failed to load profile");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [id, isOwnProfile]);

  function startEditing() {
    if (!canManageEmployees) return;
    if (!user?.id) return;
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  if (loading)
    return <FeedbackMessage type="loading" message="Loading assets..." />;
  if (error) return <FeedbackMessage type="error" message={error} />;
  if (!user)
    return <FeedbackMessage type="loading" message="Profile not found..." />;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const roleClass = ROLE_BADGE_CLASS[user.role] ?? styles.roleAUTHENTICATED;
  const activeClass = user.active
    ? assetDetailStyles.statusActive
    : assetDetailStyles.statusInactive;
  const activeLabel = user.active ? "Active" : "Inactive";

  return (
    <div className={assetDetailStyles.page}>
      <section className={assetDetailStyles.summary}>
        <p className={assetDetailStyles.name}>{fullName || "User"}</p>

        <div className={assetDetailStyles.meta}>
          <div className={styles.badges}>
            <span className={`${assetDetailStyles.status} ${activeClass}`}>
              {activeLabel}
            </span>

            {user.role ? (
              <span className={`${styles.roleBadge} ${roleClass}`}>
                {user.role}
              </span>
            ) : null}
          </div>

          <div className={styles.summaryRight}>
            <span className={assetDetailStyles.lastLog}>
              Employee #{user.id}
            </span>

            {canManageEmployees ? (
              <Button
                type="button"
                className={styles.iconButton}
                handler={isEditing ? cancelEditing : startEditing}
                title={isEditing ? "Cancel" : "Edit"}
                buttonText="Edit"
              />
            ) : null}
          </div>
        </div>
      </section>

      <EditProfileForm
        user={user}
        isEditing={isEditing}
        onCancelEditing={cancelEditing}
        onUserUpdated={(updated) => {
          setUser(updated);
          setIsEditing(false);
        }}
      />

      <AdminActions
        user={user}
        isVisible={canAdminEmployees && !isOwnProfile}
        onUserUpdated={setUser}
      />

      <PasswordChangeForm employeeId={authUser?.id} isVisible={isOwnProfile} />
    </div>
  );
}

export default UserProfile;
