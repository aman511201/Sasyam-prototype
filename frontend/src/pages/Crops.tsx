import { useState } from "react";
import {
  Droplets,
  Leaf,
  MapPin,
  Plus,
  ScanLine,
  Sprout,
  ThermometerSun,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Link } from "react-router-dom";

interface CropItem {
  id: string;
  name: string;
  variety: string;
  farm: string;
  acres: number;
  sowingDate: string;
  harvestDate: string;
  stage: string;
  stagePercent: number;
  expectedYieldKg: number;
  soilMoisture: number;
  status: "Healthy" | "Needs Attention" | "Harvest Ready";
  pestRisk: "Low" | "Medium" | "High";
}

const initialCrops: CropItem[] = [
  {
    id: "1",
    name: "Wheat",
    variety: "Sharbati (PBW-550)",
    farm: "Green Acre Farm (Plot #1)",
    acres: 3.5,
    sowingDate: "Nov 12, 2025",
    harvestDate: "Apr 05, 2026",
    stage: "Tillering & Crown Root (Day 45 of 120)",
    stagePercent: 38,
    expectedYieldKg: 6800,
    soilMoisture: 68,
    status: "Healthy",
    pestRisk: "Low",
  },
  {
    id: "2",
    name: "Tomato",
    variety: "Abhinav Hybrid Red",
    farm: "Sunrise Polyhouse (Plot #2)",
    acres: 1.8,
    sowingDate: "Dec 05, 2025",
    harvestDate: "Mar 10, 2026",
    stage: "Fruiting & Ripening (Day 62 of 90)",
    stagePercent: 70,
    expectedYieldKg: 8500,
    soilMoisture: 54,
    status: "Needs Attention",
    pestRisk: "High",
  },
  {
    id: "3",
    name: "Basmati Rice",
    variety: "Pusa 1121",
    farm: "Riverbed Field (Plot #3)",
    acres: 4.2,
    sowingDate: "Jul 15, 2025",
    harvestDate: "Nov 25, 2025",
    stage: "Panicle Initiation (Day 75 of 135)",
    stagePercent: 55,
    expectedYieldKg: 7200,
    soilMoisture: 82,
    status: "Healthy",
    pestRisk: "Medium",
  },
  {
    id: "4",
    name: "Potato",
    variety: "Kufri Jyoti",
    farm: "North Sandy Loam (Plot #4)",
    acres: 2.0,
    sowingDate: "Oct 20, 2025",
    harvestDate: "Feb 18, 2026",
    stage: "Tuber Bulking & Maturity (Day 78 of 85)",
    stagePercent: 92,
    expectedYieldKg: 9400,
    soilMoisture: 60,
    status: "Harvest Ready",
    pestRisk: "Low",
  },
];

function Crops() {
  const [crops, setCrops] = useState<CropItem[]>(initialCrops);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newCropName, setNewCropName] = useState("Mustard");
  const [newVariety, setNewVariety] = useState("Pusa Bold");
  const [newFarm, setNewFarm] = useState("Plot #5 East");
  const [newAcres, setNewAcres] = useState("2.5");
  const [newExpectedYield, setNewExpectedYield] = useState("4500");

  const filteredCrops = crops.filter(
    (c) => filterStatus === "All" || c.status === filterStatus
  );

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    const createdCrop: CropItem = {
      id: Date.now().toString(),
      name: newCropName,
      variety: newVariety,
      farm: newFarm,
      acres: Number(newAcres) || 1,
      sowingDate: "Today",
      harvestDate: "In 90 Days",
      stage: "Germination (Day 1 of 90)",
      stagePercent: 5,
      expectedYieldKg: Number(newExpectedYield) || 3000,
      soilMoisture: 65,
      status: "Healthy",
      pestRisk: "Low",
    };
    setCrops([createdCrop, ...crops]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="My Crops & Plot Management"
        description="Monitor field acreage, sowing calendar, soil hydration, crop vegetative stages, and automated pest alert triggers."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
          >
            <Plus size={16} />
            Register New Crop
          </button>
        }
      />

      {/* Field Vitals & Soil Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Cultivated Area</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Sprout size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            11.5 <span className="text-xs font-normal text-slate-500">Acres</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Spread across 4 active plots</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Soil Moisture</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Droplets size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-blue-600">
            66% <span className="text-xs font-normal text-slate-500">Optimal</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Drip irrigation active on Plot #2</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Soil Health & pH</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <ThermometerSun size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            7.1 pH <span className="text-xs font-semibold text-emerald-600">• Neutral</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">NPK: 120-45-80 kg/ha (Healthy)</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cumulative Target Yield</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Wheat size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            31,900 <span className="text-xs font-normal text-slate-500">kg</span>
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">+8.4% above last season</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["All", "Healthy", "Needs Attention", "Harvest Ready"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              filterStatus === status
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                  <Leaf size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{crop.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        crop.status === "Healthy"
                          ? "bg-emerald-100 text-emerald-800"
                          : crop.status === "Harvest Ready"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {crop.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{crop.variety}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={11} /> {crop.farm} • {crop.acres} Acres
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Target Yield</span>
                <p className="font-black text-slate-900 text-sm">
                  {(crop.expectedYieldKg / 1000).toFixed(1)} MT ({crop.expectedYieldKg.toLocaleString()} kg)
                </p>
              </div>
            </div>

            {/* Growth Progress */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{crop.stage}</span>
                <span className="font-bold text-emerald-600">{crop.stagePercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${crop.stagePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Field Parameter Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Moisture</span>
                <p className="font-bold text-slate-800 mt-0.5">{crop.soilMoisture}%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Sown Date</span>
                <p className="font-bold text-slate-800 mt-0.5 text-[11px] truncate">{crop.sowingDate}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Pest Risk</span>
                <p
                  className={`font-bold mt-0.5 ${
                    crop.pestRisk === "High"
                      ? "text-rose-600"
                      : crop.pestRisk === "Medium"
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {crop.pestRisk}
                </p>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Link
                to="/app/disease-detection"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800 transition"
              >
                <ScanLine size={14} className="text-emerald-600" />
                Scan Leaf
              </Link>
              <Link
                to="/app/decision-engine"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
              >
                <Zap size={14} />
                Decision Engine
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sprout size={18} className="text-emerald-600" />
                Register New Crop Plot
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Crop Type</label>
                <input
                  type="text"
                  required
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  placeholder="e.g. Mustard, Cotton, Soybean, Onion"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Seed Variety</label>
                <input
                  type="text"
                  required
                  value={newVariety}
                  onChange={(e) => setNewVariety(e.target.value)}
                  placeholder="e.g. Pusa Bold / Giriraj"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Plot Name</label>
                  <input
                    type="text"
                    required
                    value={newFarm}
                    onChange={(e) => setNewFarm(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Acreage</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newAcres}
                    onChange={(e) => setNewAcres(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Expected Harvest Yield (kg)</label>
                <input
                  type="number"
                  required
                  value={newExpectedYield}
                  onChange={(e) => setNewExpectedYield(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
                >
                  Save & Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Crops;