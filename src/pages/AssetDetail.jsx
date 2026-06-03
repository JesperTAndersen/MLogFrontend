import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getAssetById } from "../utils/assetApi";
import { getLogsForAsset } from "../utils/logApi";
import LogCard from "../components/logsComponents/LogCard";
import Select from "../components/shared/Select";
import styles from "./AssetDetail.module.css";
import { formatDateTime } from "../utils/formatDateTime";
import { useAuth } from "../context/authContext";
import AssetAdminActions from "../components/assets/AssetAdminActions";
import feedbackStyles from "../styles/feedback.module.css";

const LOG_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "FAILED", label: "Failed" },
  { value: "DONE", label: "Done" },
];

const LOG_TASK_TYPE_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "PRODUCTION", label: "Production" },
  { value: "ERROR", label: "Error" },
];

function AssetDetail() {
  const [asset, setAsset] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [taskTypeFilter, setTaskTypeFilter] = useState(null);
  const { hasRole } = useAuth();
  const { id } = useParams();

  const canCreateLog = hasRole("TECHNICIAN") && asset?.active === true;
  const isAdmin = hasRole("ADMIN");

  useEffect(() => {
    async function fetchAsset() {
      try {
        setLoading(true);
        setError(null);
        const assetData = await getAssetById(id);
        setAsset(assetData);
      } catch (err) {
        setError(err?.message ?? "Failed to load asset details");
      } finally {
        setLoading(false);
      }
    }
    fetchAsset();
  }, [id]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoadingLogs(true);
        const logsData = await getLogsForAsset(
          id,
          statusFilter,
          taskTypeFilter,
        );
        setLogs(logsData);
      } catch (err) {
        setError(err?.message ?? "Failed to load logs");
      } finally {
        setLoadingLogs(false);
      }
    }
    fetchLogs();
  }, [id, statusFilter, taskTypeFilter]);

  function handleTaskTypeChange(e) {
    const value = e.target.value;
    setTaskTypeFilter(value === "" ? null : value);
  }

  function handleStatusChange(e) {
    const value = e.target.value;
    setStatusFilter(value === "" ? null : value);
  }

  if (loading) return <h1>Loading asset…</h1>;

  if (error)
    return (
      <div className={styles.page}>
        <section className={feedbackStyles.card}>
          <p className={feedbackStyles.errorText}>{error}</p>
        </section>
      </div>
    );

  return (
    <div className={styles.page}>
      <section className={styles.summary}>
        <p className={styles.name}>{asset?.name}</p>

        {asset?.description && (
          <p className={styles.description}>{asset.description}</p>
        )}

        <div className={styles.meta}>
          {asset?.active === true ? (
            <span className={`${styles.status} ${styles.statusActive}`}>
              Active
            </span>
          ) : (
            <span className={`${styles.status} ${styles.statusInactive}`}>
              Inactive
            </span>
          )}

          {asset?.lastLogDate && (
            <span className={styles.lastLog}>
              Last log: {formatDateTime(asset.lastLogDate)}
            </span>
          )}
        </div>
      </section>

      <AssetAdminActions
        key={asset?.id ?? id}
        asset={asset}
        isVisible={isAdmin}
        onAssetUpdated={setAsset}
      />

      <section className={styles.logs}>
        <div className={styles.toolbar}>
          <Select
            labelText="Task type"
            value={taskTypeFilter ?? ""}
            onChange={handleTaskTypeChange}
            options={LOG_TASK_TYPE_FILTER_OPTIONS}
          />

          <Select
            labelText="Status"
            value={statusFilter ?? ""}
            onChange={handleStatusChange}
            options={LOG_STATUS_FILTER_OPTIONS}
          />

          {canCreateLog && (
            <Link
              to={`/assets/${id}/createlog`}
              className={`${styles.createLog} ${styles.createLogInline}`}
            >
              Create log
            </Link>
          )}
        </div>

        {loadingLogs && <p className={styles.loading}>Updating logs...</p>}

        {logs.length === 0 ? (
          <p className={styles.empty}>
            {statusFilter || taskTypeFilter
              ? "No logs match those filters."
              : "No logs for this asset yet."}
          </p>
        ) : (
          logs.map((log) => (
            <LogCard key={log.id} log={log} showAssetName={false} />
          ))
        )}
      </section>
    </div>
  );
}

export default AssetDetail;
