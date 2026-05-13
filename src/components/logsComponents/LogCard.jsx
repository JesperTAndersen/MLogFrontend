import { useState } from "react";
import styles from "./LogCard.module.css";
import { formatDateTime } from "../../utils/formatDateTime";

function toStatusLabel(status) {
  if (!status) return "";
  return String(status).replaceAll("_", " ");
}

function LogCard({ log }) {
  const [expanded, setExpanded] = useState(false);

  const statusLabel = toStatusLabel(log?.status);
  const statusClass =
    log?.status === "DONE"
      ? styles.statusSuccess
      : log?.status === "FAILED"
        ? styles.statusError
        : "";
  const performedDateText = formatDateTime(log?.performedDate);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <button
      type="button"
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
        {log?.performedByName ? (
          <span className={styles.user} title={log.performedByName}>
            {log.performedByName}
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

          {log?.taskType ? (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Task</span>
              <span className={styles.detailValue}>{log.taskType}</span>
            </div>
          ) : null}

          {statusLabel ? (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>{statusLabel}</span>
            </div>
          ) : null}

          {performedDateText ? (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Performed</span>
              <span className={styles.detailValue}>{performedDateText}</span>
            </div>
          ) : null}

          {log?.performedByName ? (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>By</span>
              <span className={styles.detailValue}>
                {log.performedByName}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </button>
  );
}

export default LogCard;
