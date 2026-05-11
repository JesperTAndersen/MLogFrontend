import { useEffect, useState } from "react";
import AssetCard from "../components/assets/AssetCard";
import { getAssets } from "../../apiReader";

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

  if (loading) return <h1>Loading assets…</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <>
      <h1> Asset List page</h1>
      <label>
        Filter by status:
        <select
          value={activeFilter ?? "null"}
          name="choice"
          onChange={statusFilter}
        >
          <option value="null">Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </label>
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </>
  );
}

export default AssetList;
