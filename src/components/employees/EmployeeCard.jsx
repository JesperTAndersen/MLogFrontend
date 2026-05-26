import { useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import cardStyles from "../assets/AssetCard.module.css";
import profileStyles from "../../pages/UserProfile.module.css";
import Button from "../shared/Button";
import styles from "./EmployeeCard.module.css";

const ROLE_BADGE_CLASS = {
  ADMIN: profileStyles.roleADMIN,
  MANAGER: profileStyles.roleMANAGER,
  TECHNICIAN: profileStyles.roleTECHNICIAN,
  AUTHENTICATED: profileStyles.roleAUTHENTICATED,
};

function EmployeeCard({ employee }) {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const canViewPerformedLogs = hasRole?.("MANAGER") === true;

  const fullName = [employee.firstName, employee.lastName]
    .filter(Boolean)
    .join(" ");

  const roleClass =
    ROLE_BADGE_CLASS[employee.role] ?? profileStyles.roleAUTHENTICATED;

  function handleViewLogs(e) {
    e.stopPropagation();
    navigate(`/employees/${employee.id}/logs`);
  }

  return (
    <>
      <section
        className={cardStyles.card}
        onClick={() => navigate(`/employees/${employee.id}`)}
      >
        <div className={styles.left}>
          <p className={styles.name}>{fullName}</p>
          {employee.email ? (
            <p className={styles.metaLine} title={employee.email}>
              {employee.email}
            </p>
          ) : null}
          {employee.phone ? (
            <p
              className={`${styles.metaLine} ${styles.metaLineTight}`}
              title={employee.phone}
            >
              {employee.phone}
            </p>
          ) : null}
        </div>

        <div className={styles.right}>
          <span
            className={`${cardStyles.status} ${
              employee.active
                ? cardStyles.statusActive
                : cardStyles.statusInactive
            }`}
          >
            {employee.active ? "Active" : "Inactive"}
          </span>

          {employee.role ? (
            <span className={`${profileStyles.roleBadge} ${roleClass}`}>
              {employee.role}
            </span>
          ) : null}

          {canViewPerformedLogs ? (
            <Button
              type="button"
              className={`${profileStyles.roleBadge} ${profileStyles.roleAUTHENTICATED} ${styles.viewLogsButton}`}
              handler={handleViewLogs}
              buttonText="View performed logs"
            />
          ) : null}
        </div>
      </section>
    </>
  );
}

export default EmployeeCard;
