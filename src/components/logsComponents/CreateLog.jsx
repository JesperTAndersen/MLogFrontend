import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createLog } from "../../utils/logApi";
import { normalizeDate } from "../../utils/formatDateTime";
import Button from "../shared/Button";
import Select from "../shared/Select";
import formStyles from "../../styles/forms.module.css";
import styles from "./CreateLog.module.css";

const STATUS_OPTIONS = [
  { value: "", label: "Select status" },
  { value: "DONE", label: "Done" },
  { value: "FAILED", label: "Failed" },
];

const TASK_TYPE_OPTIONS = [
  { value: "", label: "Select task type" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "PRODUCTION", label: "Production" },
  { value: "ERROR", label: "Error" },
];

function toDateTimeLocalMaxValue(date = new Date()) {
  const pad2 = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const min = pad2(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function CreateLog() {
  const navigate = useNavigate();
  const { id: assetId } = useParams();

  const [performedDate, setPerformedDate] = useState("");
  const [status, setStatus] = useState("");
  const [taskType, setTaskType] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function submitLog(e) {
    e?.preventDefault?.();
    setError(null);

    if (submitting) return;

    if (!assetId) return setError("Missing asset id.");
    if (!performedDate) return setError("Performed date is required.");
    if (!status) return setError("Status is required.");
    if (!taskType) return setError("Task type is required.");
    if (!comment) return setError("Comment is required.");

    const performed = new Date(performedDate);
    if (Number.isNaN(performed.getTime())) {
      return setError("Performed date is invalid.");
    }
    if (performed.getTime() > Date.now()) {
      return setError("Performed date cannot be in the future.");
    }

    const logBody = {
      performedDate: normalizeDate(performedDate),
      status,
      taskType,
      comment,
    };

    try {
      setSubmitting(true);
      await createLog(assetId, logBody);
      navigate(`/assets/${assetId}/logs`, { replace: true });
    } catch (err) {
      setError(err?.message ?? "Failed to create log");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitLog} className={styles.form}>
      <label className={formStyles.label}>
        Performed date
        <input
          type="datetime-local"
          value={performedDate}
          onChange={(e) => setPerformedDate(e.target.value)}
          max={toDateTimeLocalMaxValue()}
          required
          className={formStyles.control}
        />
      </label>

      <Select
        labelText="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={STATUS_OPTIONS}
        required
      />

      <Select
        labelText="Task type"
        value={taskType}
        onChange={(e) => setTaskType(e.target.value)}
        options={TASK_TYPE_OPTIONS}
        required
      />

      <label className={formStyles.label}>
        Comment
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Routine check"
          rows={6}
          className={`${formStyles.control} ${formStyles.textarea}`}
        />
      </label>

      {error ? (
        <p className={`${formStyles.message} ${formStyles.error}`}>{error}</p>
      ) : null}

      <Button buttonText={submitting ? "Creating…" : "Create log"} />
    </form>
  );
}

export default CreateLog;
