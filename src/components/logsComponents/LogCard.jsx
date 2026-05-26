import { useState } from "react";
import { Link } from "react-router";
import styles from "./LogCard.module.css";
import { formatDateTime } from "../../utils/formatDateTime";

function toStatusLabel(status) {
  if (!status) return "";
  return String(status).replaceAll("_", " ");
}

function LogCard({ log, showAssetName = false }) {
  const [expanded, setExpanded] = useState(false);

  const statusLabel = toStatusLabel(log?.status);
  const statusClass =
    log?.status === "DONE"
      ? styles.statusSuccess
      : log?.status === "FAILED"
        ? styles.statusError
        : "";
  const performedDateText = formatDateTime(log?.performedDate);
  const assetId = log?.assetId ?? null;
  const assetName = log?.assetName ?? null;
  const performedByName = log?.performedByName;
  const performedById =
    log?.performedByUserId ?? log?.performedByEmployeeId ?? null;

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div
      className={styles.card}
      onClick={toggleExpanded}
    >
      <div className={styles.top}>
        <p className={styles.task} title={log?.taskType ?? ""}>
          {log?.taskType ?? "Log"}
        </p>
        {statusLabel ? (
          <span
            className={
              statusClass ? `${styles.status} ${statusClass}` : styles.status
            }
          >
            {statusLabel}
          </span>
        ) : null}
      </div>

      <div className={styles.meta}>
        {performedDateText ? (
          <span className={styles.date}>{performedDateText}</span>
        ) : null}

        {showAssetName && assetName ? (
          <span className={styles.asset} title={assetName}>
            {assetName}
          </span>
        ) : null}
      </div>

      {log?.comment ? (
        <p
          className={
            expanded
              ? `${styles.comment} ${styles.commentFull}`
              : styles.comment
          }
        >
          {log.comment}
        </p>
      ) : null}

      {expanded ? (
        <div className={styles.details}>
          {log?.id != null ? (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Log ID</span>
              <span className={styles.detailValue}>{log.id}</span>
            </div>
          ) : null}

          {assetId != null ? (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Asset</span>
              <Link
                to={`/assets/${assetId}/logs`}
                className={styles.assetLink}
                onClick={(e) => e.stopPropagation()}
              >
                {assetName}
              </Link>
            </div>
          ) : null}

          {performedByName ? (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>By</span>
              {performedById != null ? (
                <Link
                  to={`/employees/${performedById}`}
                  className={styles.assetLink}
                  onClick={(e) => e.stopPropagation()}
                  title={performedByName}
                >
                  {performedByName}
                </Link>
              ) : (
                <span className={styles.detailValue} title={performedByName}>
                  {performedByName}
                </span>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default LogCard;
