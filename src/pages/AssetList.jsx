import { useEffect, useState } from "react";
import AssetCard from "../components/assets/AssetCard";
import Select from "../components/shared/Select";
import { getAssets } from "../utils/assetApi";
import styles from "./AssetList.module.css";
import FeedbackMessage from "../components/shared/FeedbackMessage";

const ASSET_STATUS_FILTER_OPTIONS = [
  { value: "null", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const data = await getAssets(activeFilter);
        setAssets(data);
      } catch (err) {
        setError(err?.message ?? "Failed to load Assets");
      } finally {
        setLoading(false);
      }
    }
    fetchAssets();
  }, [activeFilter]);

  function statusFilter(e) {
    const value = e.target.value;
    if (value === "null") setActiveFilter(null);
    else setActiveFilter(value === "true");
  }

  if (loading)
    return <FeedbackMessage type="loading" message="Loading assets..." />;
  if (error) return <FeedbackMessage type="error" message={error} />;

  return (
    <>
      <div className={styles.toolbarSingle}>
        <Select
          labelText="Filter by status"
          value={activeFilter ?? "null"}
          onChange={statusFilter}
          options={ASSET_STATUS_FILTER_OPTIONS}
        />
      </div>
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </>
  );
}

export default AssetList;
