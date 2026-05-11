import { useState } from "react";
import "./LogCard.css";
import { formatDaDateTime } from "../../utils/formatDaDateTime";

const STATUS_CLASS = {
  DONE: "log-card-status--success",
  FAILED: "log-card-status--error",
};

function toStatusLabel(status) {
  if (!status) return "";
  return String(status).replaceAll("_", " ");
}

function LogCard({ log }) {
  const [expanded, setExpanded] = useState(false);

  const statusLabel = toStatusLabel(log?.status);
  const statusClass = STATUS_CLASS[log?.status] ?? "";
  const performedDateText = formatDaDateTime(log?.performedDate);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <button
      type="button"
      className={expanded ? "log-card log-card--expanded" : "log-card"}
      onClick={toggleExpanded}
    >
      <div className="log-card-top">
        <p className="log-card-task" title={log?.taskType ?? ""}>
          {log?.taskType ?? "Log"}
        </p>
        {statusLabel ? (
          <span
            className={
              statusClass ? `log-card-status ${statusClass}` : "log-card-status"
            }
          >
            {statusLabel}
          </span>
        ) : null}
      </div>

      <div className="log-card-meta">
        {performedDateText ? (
          <span className="log-card-date">{performedDateText}</span>
        ) : null}
        {log?.performedByName ? (
          <span className="log-card-user" title={log.performedByName}>
            {log.performedByName}
          </span>
        ) : null}
      </div>

      {log?.comment ? (
        <p
          className={
            expanded
              ? "log-card-comment log-card-comment--full"
              : "log-card-comment"
          }
        >
          {log.comment}
        </p>
      ) : null}

      {expanded ? (
        <div className="log-card-details">
          {log?.id != null ? (
            <div className="log-card-detail-row">
              <span className="log-card-detail-label">Log ID</span>
              <span className="log-card-detail-value">{log.id}</span>
            </div>
          ) : null}

          {log?.taskType ? (
            <div className="log-card-detail-row">
              <span className="log-card-detail-label">Task</span>
              <span className="log-card-detail-value">{log.taskType}</span>
            </div>
          ) : null}

          {statusLabel ? (
            <div className="log-card-detail-row">
              <span className="log-card-detail-label">Status</span>
              <span className="log-card-detail-value">{statusLabel}</span>
            </div>
          ) : null}

          {performedDateText ? (
            <div className="log-card-detail-row">
              <span className="log-card-detail-label">Performed</span>
              <span className="log-card-detail-value">{performedDateText}</span>
            </div>
          ) : null}

          {log?.performedByName ? (
            <div className="log-card-detail-row">
              <span className="log-card-detail-label">By</span>
              <span className="log-card-detail-value">
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
