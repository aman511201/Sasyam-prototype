import { useState } from "react";
import type {
  FarmerField,
  WarehouseLocation,
  NewDispatchRequest,
} from "@/types/logistics";
import {
  X,
  Truck,
  Warehouse,
  Sprout,
  Thermometer,
  ShieldCheck,
  IndianRupee,
  Navigation,
} from "lucide-react";
import { calculateDistanceKm } from "@/services/logisticsService";

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FarmerField[];
  warehouses: WarehouseLocation[];
  onDispatch: (request: NewDispatchRequest) => void;
}

export function DispatchModal({
  isOpen,
  onClose,
  fields,
  warehouses,
  onDispatch,
}: DispatchModalProps) {
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id || "");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || "");
  const [cropBatchCode, setCropBatchCode] = useState("BATCH-TM-2026-05");
  const [crop, setCrop] = useState("Tomato");
  const [variety, setVariety] = useState("Abhinav Hybrid");
  const [quantityKg, setQuantityKg] = useState(3800);
  const [vehicleType, setVehicleType] = useState<
    "Reefer Van (Cold Chain)" | "Heavy Flatbed (16-Wheeler)" | "Mahindra Bolero Maxi"
  >("Reefer Van (Cold Chain)");
  const [targetTempC, setTargetTempC] = useState<number>(5.5);
  const [driverName, setDriverName] = useState("Manpreet Singh");
  const [driverPhone, setDriverPhone] = useState("+91 98881-22990");
  const [vehicleNumber, setVehicleNumber] = useState("PB-10-DF-7821");

  if (!isOpen) return null;

  const currentField = fields.find((f) => f.id === selectedFieldId) || fields[0];
  const currentWarehouse = warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];

  // Dynamic distance & cost estimation
  const estDistanceKm =
    currentField && currentWarehouse
      ? calculateDistanceKm(
          currentField.coordinates[0],
          currentField.coordinates[1],
          currentWarehouse.coordinates[0],
          currentWarehouse.coordinates[1]
        ) * 1.25
      : 20;

  const ratePerKm = vehicleType.includes("Reefer") ? 45 : vehicleType.includes("Heavy") ? 65 : 28;
  const estimatedCost = Math.round(estDistanceKm * ratePerKm + (quantityKg / 1000) * 120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onDispatch({
      originFieldId: selectedFieldId,
      destinationWarehouseId: selectedWarehouseId,
      cropBatchCode,
      crop,
      variety,
      quantityKg: Number(quantityKg),
      vehicleType,
      targetTempC: vehicleType.includes("Reefer") ? targetTempC : undefined,
      driverName,
      driverPhone,
      vehicleNumber,
    });

    onClose();
  };

  // Sync crop recommendation based on selected field
  const handleFieldChange = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      setCrop(field.crop);
      setVariety(field.variety);
      setQuantityKg(field.readyForDispatchKg > 0 ? field.readyForDispatchKg : 3000);
      if (field.crop.toLowerCase().includes("tomato")) {
        setVehicleType("Reefer Van (Cold Chain)");
        setTargetTempC(5.5);
        setCropBatchCode("BATCH-TM-2026-05");
      } else if (field.crop.toLowerCase().includes("rice")) {
        setVehicleType("Heavy Flatbed (16-Wheeler)");
        setCropBatchCode("BATCH-RC-2026-02");
      } else {
        setVehicleType("Heavy Flatbed (16-Wheeler)");
        setCropBatchCode("BATCH-WH-2026-01");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Truck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Book Transporter & Dispatch Batch
              </h2>
              <p className="text-xs text-slate-500">
                Schedule a verified agri-carrier from your farm dock to cold storage / silo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Origin & Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Sprout size={14} className="text-emerald-600" />
                Origin: Farmer Field & Dock
              </label>
              <select
                value={selectedFieldId}
                onChange={(e) => handleFieldChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name} ({field.readyForDispatchKg} kg ready)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Warehouse size={14} className="text-indigo-600" />
                Destination: Warehouse / Cold Hub
              </label>
              <select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name} ({wh.availableBays} bays open)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Crop & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop & Batch Code
              </label>
              <input
                type="text"
                value={`${crop} (${cropBatchCode})`}
                onChange={(e) => setCropBatchCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity (Kg)
              </label>
              <input
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                min={100}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Carrier Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) =>
                  setVehicleType(
                    e.target.value as
                      | "Reefer Van (Cold Chain)"
                      | "Heavy Flatbed (16-Wheeler)"
                      | "Mahindra Bolero Maxi"
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium"
              >
                <option value="Reefer Van (Cold Chain)">Reefer Van (Cold Chain)</option>
                <option value="Heavy Flatbed (16-Wheeler)">Heavy Flatbed (16-Wheeler)</option>
                <option value="Mahindra Bolero Maxi">Mahindra Bolero Maxi (Express)</option>
              </select>
            </div>
          </div>

          {/* Cold Chain Sensor Target if Reefer */}
          {vehicleType.includes("Reefer") && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer size={18} className="text-sky-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-sky-950">Active Cold-Chain Telemetry</p>
                  <p className="text-[11px] text-sky-700">
                    IoT sensors will monitor temperature throughout the transit
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-sky-900">Target Temp:</span>
                <input
                  type="number"
                  step="0.5"
                  value={targetTempC}
                  onChange={(e) => setTargetTempC(Number(e.target.value))}
                  className="w-16 rounded-lg border border-sky-300 bg-white px-2 py-1 text-xs font-bold text-sky-900 text-center"
                />
                <span className="text-xs font-semibold text-sky-900">°C</span>
              </div>
            </div>
          )}

          {/* Carrier & Driver Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Plate No.
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. PB-10-XX-1234"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Driver Name
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Driver Phone
              </label>
              <input
                type="text"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-800"
                required
              />
            </div>
          </div>

          {/* Route Summary & Cost Estimation Pill */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Navigation size={18} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Route Distance: ~{estDistanceKm.toFixed(1)} km
                </p>
                <p className="text-[11px] text-slate-500">
                  Via Punjab Highway Network • Estimated transit: ~{Math.round((estDistanceKm / 45) * 60)} mins
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 shadow-xs">
              <IndianRupee size={15} className="text-emerald-600" />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">
                  Est. Freight
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  ₹{estimatedCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700 transition"
            >
              <ShieldCheck size={16} />
              Confirm & Dispatch Live Transporter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DispatchModal;
