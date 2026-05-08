import { useState } from "react";
import AssetCard from "../components/assets/AssetCard";

function AssetList() {
  const [assets, setAssets] = useState([
    {
    id: 1,
    name: "Hydraulic Press #3",
    description: "Main production press",
    active: true,
    lastLogDate: "2026-04-09T14:30:00"
  },
  {
    id: 2,
    name: "Conveyor Belt A1",
    description: "Feeds raw materials to assembly line",
    active: true,
    lastLogDate: "2026-05-01T09:15:22"
  },
  {
    id: 3,
    name: "Cooling System Unit 7",
    description: "Regulates temperature for molding machines",
    active: false,
    lastLogDate: "2026-03-28T22:47:10"
  },
  {
    id: 4,
    name: "Packaging Robot X2",
    description: "Automated packaging and labeling system",
    active: true,
    lastLogDate: "2026-05-03T16:05:45"
  },
  {
    id: 5,
    name: "Forklift FL-12",
    description: "Warehouse transport vehicle",
    active: true,
    lastLogDate: "2026-05-02T11:20:33"
  },
  {
    id: 6,
    name: "Air Compressor C9",
    description: "Supplies compressed air to tools",
    active: false,
    lastLogDate: "2026-02-14T08:05:12"
  },
  {
    id: 7,
    name: "Laser Cutter LC-4",
    description: "Precision cutting for metal sheets",
    active: true,
    lastLogDate: "2026-05-04T07:55:00"
  },
  {
    id: 8,
    name: "Assembly Arm R2",
    description: "Robotic arm for assembly tasks",
    active: true,
    lastLogDate: "2026-04-30T13:40:19"
  },
  {
    id: 9,
    name: "Quality Scanner QS-8",
    description: "Inspects finished goods for defects",
    active: false,
    lastLogDate: "2026-03-10T17:25:54"
  },
  {
    id: 10,
    name: "Backup Generator G1",
    description: "Provides emergency power supply",
    active: true,
    lastLogDate: "2026-05-01T03:10:08"
  },
  ]);

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
