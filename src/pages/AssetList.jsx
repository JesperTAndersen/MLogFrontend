import { useEffect, useState } from "react";
import AssetCard from "../components/assets/AssetCard";
import { getAssets } from "../../apiReader";

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAssets()
      .then((data) => {
        setAssets(data);
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to load assets");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <h1>Loading assets…</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <>
      <h1> Asset List page</h1>
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </>
  );
}

export default AssetList;
