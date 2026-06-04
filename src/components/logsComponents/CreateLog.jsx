import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createLog } from "../../utils/logApi";
import { normalizeDate, toDateTimeLocalMaxValue } from "../../utils/formatDateTime";
import Button from "../shared/Button";
import Select from "../shared/Select";
import TextAreaField from "../shared/TextAreaField";
import formStyles from "../../styles/forms.module.css";
import styles from "./CreateLog.module.css";
import {
  LOG_STATUS_CREATING,
  LOG_TASK_TYPE_FILTER_OPTIONS,
} from "../../utils/constants/filterOptions";

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
        Performed date *
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
        options={LOG_STATUS_CREATING}
        required
      />

      <Select
        labelText="Task type"
        value={taskType}
        onChange={(e) => setTaskType(e.target.value)}
        options={LOG_TASK_TYPE_FILTER_OPTIONS}
        required
      />

      <TextAreaField
        label="Comment"
        value={comment}
        onChange={setComment}
        placeholder="Routine check"
        rows={6}
        required
      />

      {error ? (
        <p className={`${formStyles.message} ${formStyles.error}`}>{error}</p>
      ) : null}

      <Button buttonText={submitting ? "Creating…" : "Create log"} />
    </form>
  );
}

export default CreateLog;
