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
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [taskTypeFilter, setTaskTypeFilter] = useState(null);

  const { hasRole } = useAuth();

  const canCreateLog = hasRole("TECHNICIAN") && asset?.active === true;
  const isAdmin = hasRole("ADMIN");

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [assetData, logsData] = await Promise.all([
          getAssetById(id),
          getLogsForAsset(id, statusFilter, taskTypeFilter),
        ]);
        setAsset(assetData);
        setLogs(logsData);
      } catch (err) {
        setError(err?.message ?? "Failed to load asset details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, taskTypeFilter, statusFilter]);

  function handleTaskTypeChange(e) {
    const value = e.target.value;
    setTaskTypeFilter(value === "" ? null : value);
  }

  function handleStatusChange(e) {
    const value = e.target.value;
    setStatusFilter(value === "" ? null : value);
  }

  if (loading) return <h1>Loading assets…</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <div className={styles.page}>
      <section className={styles.summary} >
        <p className={styles.name}>{asset?.name}</p>
        {asset?.description ? (
          <p className={styles.description}>{asset.description}</p>
        ) : null}

        <div className={styles.meta}>
          {asset?.active === true ? (
            <span className={`${styles.status} ${styles.statusActive}`}>
              Active
            </span>
          ) : asset?.active === false ? (
            <span className={`${styles.status} ${styles.statusInactive}`}>
              Inactive
            </span>
          ) : null}

          {asset?.lastLogDate ? (
            <span className={styles.lastLog}>
              Last log: {formatDateTime(asset.lastLogDate)}
            </span>
          ) : null}
        </div>
      </section>

      <AssetAdminActions
        key={asset?.id ?? id}
        asset={asset}
        isVisible={isAdmin}
        onAssetUpdated={setAsset}
      />
      
     
      <section className={styles.logs}>
        <>
          <div className={styles.toolbar}>
            <Select
              labelText="Status"
              value={statusFilter ?? ""}
              onChange={handleStatusChange}
              options={LOG_STATUS_FILTER_OPTIONS}
            />

            <Select
              labelText="Task type"
              value={taskTypeFilter ?? ""}
              onChange={handleTaskTypeChange}
              options={LOG_TASK_TYPE_FILTER_OPTIONS}
            />

            {canCreateLog ? (
              <Link
                to={`/assets/${id}/createlog`}
                className={`${styles.createLog} ${styles.createLogInline}`}
              >
                Create log
              </Link>
            ) : null}
          </div>

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
        </>
      </section>
    </div>
  );
}

export default AssetDetail;
