import { useState } from "react";
import {
  Clock,
  Droplets,
  Package,
  Plus,
  ShieldAlert,
  Snowflake,
  Thermometer,
  Warehouse,
  X,
  Zap,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Link } from "react-router-dom";

interface ProduceBatch {
  id: string;
  batchCode: string;
  crop: string;
  variety: string;
  quantityKg: number;
  grade: "Grade A+" | "Grade A" | "Grade B" | "Grade C";
  harvestDate: string;
  storageType: "Cold Storage (Chamber #2)" | "Controlled Atmosphere (CA)" | "Farm Silo" | "Ambient Shed";
  temperatureC: number;
  humidityPercent: number;
  shelfLifeDaysLeft: number;
  totalShelfLifeDays: number;
  status: "Optimal" | "Action Needed" | "Expiring Soon";
}

const initialBatches: ProduceBatch[] = [
  {
    id: "1",
    batchCode: "BATCH-TM-2026-04",
    crop: "Tomato",
    variety: "Abhinav Hybrid",
    quantityKg: 4200,
    grade: "Grade A",
    harvestDate: "Feb 14, 2026",
    storageType: "Cold Storage (Chamber #2)",
    temperatureC: 6.5,
    humidityPercent: 88,
    shelfLifeDaysLeft: 14,
    totalShelfLifeDays: 25,
    status: "Optimal",
  },
  {
    id: "2",
    batchCode: "BATCH-PT-2026-01",
    crop: "Potato",
    variety: "Kufri Jyoti",
    quantityKg: 12500,
    grade: "Grade A+",
    harvestDate: "Jan 28, 2026",
    storageType: "Controlled Atmosphere (CA)",
    temperatureC: 4.0,
    humidityPercent: 92,
    shelfLifeDaysLeft: 42,
    totalShelfLifeDays: 90,
    status: "Optimal",
  },
  {
    id: "3",
    batchCode: "BATCH-RC-2025-11",
    crop: "Basmati Rice",
    variety: "Pusa 1121",
    quantityKg: 7800,
    grade: "Grade A+",
    harvestDate: "Nov 30, 2025",
    storageType: "Farm Silo",
    temperatureC: 18.2,
    humidityPercent: 55,
    shelfLifeDaysLeft: 180,
    totalShelfLifeDays: 360,
    status: "Optimal",
  },
  {
    id: "4",
    batchCode: "BATCH-CH-2026-09",
    crop: "Green Chillies",
    variety: "Teja Hot",
    quantityKg: 950,
    grade: "Grade B",
    harvestDate: "Feb 20, 2026",
    storageType: "Ambient Shed",
    temperatureC: 24.5,
    humidityPercent: 62,
    shelfLifeDaysLeft: 3,
    totalShelfLifeDays: 7,
    status: "Expiring Soon",
  },
];

function Produce() {
  const [batches, setBatches] = useState<ProduceBatch[]>(initialBatches);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states
  const [newCrop, setNewCrop] = useState("Onion");
  const [newVariety, setNewVariety] = useState("Nashik Red");
  const [newQuantity, setNewQuantity] = useState("3500");
  const [newGrade, setNewGrade] = useState<"Grade A+" | "Grade A" | "Grade B">("Grade A");
  const [newStorage, setNewStorage] = useState<"Cold Storage (Chamber #2)" | "Controlled Atmosphere (CA)" | "Farm Silo" | "Ambient Shed">("Cold Storage (Chamber #2)");
  const [newShelfDays, setNewShelfDays] = useState("30");

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ProduceBatch = {
      id: Date.now().toString(),
      batchCode: `BATCH-${newCrop.slice(0, 2).toUpperCase()}-2026-${Math.floor(10 + Math.random() * 90)}`,
      crop: newCrop,
      variety: newVariety,
      quantityKg: Number(newQuantity) || 1000,
      grade: newGrade,
      harvestDate: "Today",
      storageType: newStorage,
      temperatureC: newStorage.includes("Cold") ? 4.5 : 22.0,
      humidityPercent: newStorage.includes("Cold") ? 90 : 60,
      shelfLifeDaysLeft: Number(newShelfDays) || 30,
      totalShelfLifeDays: Number(newShelfDays) || 30,
      status: "Optimal",
    };

    setBatches([created, ...batches]);
    setShowLogModal(false);
  };

  const totalStoredWeight = batches.reduce((acc, b) => acc + b.quantityKg, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Produce Inventory & Cold Chain Management"
        description="Track post-harvest storage batches, chamber temperature/humidity telemetry, shelf-life degradation, and trigger liquidation before spoilage."
        action={
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
          >
            <Plus size={16} />
            Log Harvest Batch
          </button>
        }
      />

      {/* Storage Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Produce in Stock</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Package size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {(totalStoredWeight / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-500">Metric Tons</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{totalStoredWeight.toLocaleString()} kg across {batches.length} batches</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cold Storage Telemetry</span>
            <div className="rounded-lg bg-cyan-50 p-2 text-cyan-600">
              <Snowflake size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-cyan-700">
            4.2°C <span className="text-xs font-medium text-slate-500">• 89% RH</span>
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Chamber #2 status: Normal</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Expiring / High Risk</span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <ShieldAlert size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-rose-600">
            950 <span className="text-xs font-normal text-slate-500">kg (Chillies)</span>
          </p>
          <p className="mt-1 text-[11px] text-rose-700 font-semibold">3 Days shelf life remaining</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Asset Valuation</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Warehouse size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            ₹6,45,000
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Estimated Mandi spot value</p>
        </div>
      </div>

      {/* Produce Batches Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Active Post-Harvest Batches</h3>
          <span className="text-xs text-slate-500">Real-time shelf degradation sync</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((batch) => {
            const shelfPercent = Math.round(
              (batch.shelfLifeDaysLeft / batch.totalShelfLifeDays) * 100
            );

            return (
              <div
                key={batch.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {batch.batchCode}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          batch.status === "Optimal"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800 animate-pulse"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-lg mt-1">
                      {batch.crop} <span className="text-xs font-normal text-slate-500">({batch.variety})</span>
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Warehouse size={13} className="text-slate-400" />
                      {batch.storageType}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      {batch.grade}
                    </span>
                    <p className="font-black text-slate-900 text-base mt-2">
                      {batch.quantityKg.toLocaleString()} kg
                    </p>
                  </div>
                </div>

                {/* Shelf Life Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      Remaining Shelf Life: <strong>{batch.shelfLifeDaysLeft} Days</strong>
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {shelfPercent}% remaining
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        shelfPercent < 25
                          ? "bg-rose-500"
                          : shelfPercent < 50
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${shelfPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Storage Condition Telemetry */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Thermometer size={14} className="text-rose-500" />
                    <span>Temp: <strong>{batch.temperatureC}°C</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets size={14} className="text-blue-500" />
                    <span>RH: <strong>{batch.humidityPercent}%</strong></span>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Link
                    to="/app/decision-engine"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                  >
                    <Zap size={14} />
                    Run Decision Optimizer on this Batch
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Batch Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Package size={18} className="text-emerald-600" />
                Log Harvested Produce Batch
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Crop Name</label>
                <input
                  type="text"
                  required
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Variety</label>
                  <input
                    type="text"
                    required
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Storage Facility</label>
                <select
                  value={newStorage}
                  onChange={(e: any) => setNewStorage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                >
                  <option value="Cold Storage (Chamber #2)">Cold Storage (Chamber #2)</option>
                  <option value="Controlled Atmosphere (CA)">Controlled Atmosphere (CA)</option>
                  <option value="Farm Silo">Farm Silo</option>
                  <option value="Ambient Shed">Ambient Shed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Quality Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e: any) => setNewGrade(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="Grade A+">Grade A+ (Export Quality)</option>
                    <option value="Grade A">Grade A (Premium Mandi)</option>
                    <option value="Grade B">Grade B (Standard)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Expected Shelf Life (Days)</label>
                  <input
                    type="number"
                    required
                    value={newShelfDays}
                    onChange={(e) => setNewShelfDays(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
                >
                  Log Produce Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Produce;