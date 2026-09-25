import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/common/PageHeader";
import LogisticsMap from "@/components/logistics/LogisticsMap";
import DispatchModal from "@/components/logistics/DispatchModal";
import type {
  FarmerField,
  WarehouseLocation,
  TransporterVehicle,
  LogisticsTelemetryAlert,
  NewDispatchRequest,
} from "@/types/logistics";
import {
  INITIAL_FARMER_FIELDS,
  INITIAL_WAREHOUSES,
  INITIAL_TRANSPORTERS,
  INITIAL_TELEMETRY_ALERTS,
  stepTransporterSimulation,
  createNewDispatch,
} from "@/services/logisticsService";
import {
  Truck,
  Warehouse,
  Sprout,
  Activity,
  Play,
  Pause,
  Plus,
  Phone,
  Thermometer,
  Clock,
  Compass,
  ChevronRight,
} from "lucide-react";

export function Logistics() {
  const [fields, setFields] = useState<FarmerField[]>(INITIAL_FARMER_FIELDS);
  const [warehouses] = useState<WarehouseLocation[]>(INITIAL_WAREHOUSES);
  const [transporters, setTransporters] = useState<TransporterVehicle[]>(INITIAL_TRANSPORTERS);
  const [alerts, setAlerts] = useState<LogisticsTelemetryAlert[]>(INITIAL_TELEMETRY_ALERTS);

  // Active tracking & simulation controls
  const [isLiveTrackingActive, setIsLiveTrackingActive] = useState<boolean>(true);
  const [simulationSpeedMs, setSimulationSpeedMs] = useState<number>(3000);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);

  // Selected Entity for map camera focus & details
  const [selectedEntity, setSelectedEntity] = useState<{
    type: "truck" | "warehouse" | "field";
    id: string;
  } | null>({ type: "truck", id: "trk-01" });

  // Tab state in the management sidebar: "transporters" | "warehouses" | "fields" | "alerts"
  const [activeTab, setActiveTab] = useState<"transporters" | "warehouses" | "fields" | "alerts">(
    "transporters"
  );

  // Step simulation tick
  const handleSimulationStep = useCallback(() => {
    setTransporters((prevTransporters) => {
      const { updatedTransporters, newAlerts } = stepTransporterSimulation(
        prevTransporters,
        alerts
      );
      setAlerts(newAlerts);
      return updatedTransporters;
    });
  }, [alerts]);

  // Periodic GPS live simulation stream
  useEffect(() => {
    if (!isLiveTrackingActive) return;

    const interval = setInterval(() => {
      handleSimulationStep();
    }, simulationSpeedMs);

    return () => clearInterval(interval);
  }, [isLiveTrackingActive, simulationSpeedMs, handleSimulationStep]);

  // Handle entity selection from map or list
  const handleSelectEntity = (type: "truck" | "warehouse" | "field", id: string) => {
    setSelectedEntity({ type, id });
    if (type === "truck") setActiveTab("transporters");
    else if (type === "warehouse") setActiveTab("warehouses");
    else if (type === "field") setActiveTab("fields");
  };

  // Handle New Dispatch Request
  const handleCreateDispatch = (req: NewDispatchRequest) => {
    const newVehicle = createNewDispatch(req, fields, warehouses);

    setTransporters((prev) => [newVehicle, ...prev]);

    // Update field's ready dispatch kg
    setFields((prev) =>
      prev.map((f) =>
        f.id === req.originFieldId
          ? {
              ...f,
              readyForDispatchKg: Math.max(0, f.readyForDispatchKg - req.quantityKg),
              dockStatus: "Loading",
            }
          : f
      )
    );

    // Add alert
    const newAlert: LogisticsTelemetryAlert = {
      id: `alt-new-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      vehicleId: newVehicle.id,
      vehicleNumber: newVehicle.vehicleNumber,
      type: "dispatch",
      severity: "success",
      title: "New Transport Dispatched",
      message: `${newVehicle.vehicleNumber} dispatched carrying ${req.quantityKg.toLocaleString()} kg ${req.crop} to ${newVehicle.destinationName}.`,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // Focus on new truck
    setSelectedEntity({ type: "truck", id: newVehicle.id });
    setActiveTab("transporters");
  };

  // Aggregated KPIs
  const totalCargoInTransitKg = transporters.reduce(
    (sum, t) => sum + (t.cargo?.quantityKg || 0),
    0
  );
  const totalWarehouseCapacityMT = warehouses.reduce((sum, w) => sum + w.totalCapacityMT, 0);
  const totalOccupiedMT = warehouses.reduce((sum, w) => sum + w.occupiedCapacityMT, 0);
  const availableWarehouseMT = totalWarehouseCapacityMT - totalOccupiedMT;

  const selectedTruck =
    selectedEntity?.type === "truck"
      ? transporters.find((t) => t.id === selectedEntity.id)
      : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Page Header */}
      <PageHeader
        title="Agri-Logistics & Live GPS Fleet Tracking 🚛"
        description="Monitor real-time transporter movements, farmer field dispatch docks, cold-storage warehouse capacities, and IoT cold-chain temperatures."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Play/Pause Toggle */}
            <button
              onClick={() => setIsLiveTrackingActive(!isLiveTrackingActive)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition shadow-xs ${
                isLiveTrackingActive
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              }`}
              title="Toggle Live GPS Stream"
            >
              {isLiveTrackingActive ? (
                <>
                  <Pause size={14} className="text-emerald-700 fill-emerald-700" />
                  <span>Tracking: Active</span>
                </>
              ) : (
                <>
                  <Play size={14} className="text-slate-600 fill-slate-600" />
                  <span>Tracking: Paused</span>
                </>
              )}
            </button>

            {/* Simulation Speed */}
            <div className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs">
              <span className="text-[10px] text-slate-400 px-2 font-medium">GPS Pulse:</span>
              <button
                onClick={() => setSimulationSpeedMs(5000)}
                className={`px-2 py-1 rounded-lg font-medium transition ${
                  simulationSpeedMs === 5000
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setSimulationSpeedMs(3000)}
                className={`px-2 py-1 rounded-lg font-medium transition ${
                  simulationSpeedMs === 3000
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                2x
              </button>
              <button
                onClick={() => setSimulationSpeedMs(1200)}
                className={`px-2 py-1 rounded-lg font-medium transition ${
                  simulationSpeedMs === 1200
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Fast
              </button>
            </div>

            {/* Dispatch Action Button */}
            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700 transition"
            >
              <Plus size={15} />
              Book Transporter / Dispatch
            </button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Fleet on Road</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Truck size={17} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{transporters.length}</span>
            <span className="text-xs font-semibold text-emerald-600">All Live GPS</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {transporters.filter((t) => t.status === "In Transit").length} on highway,{" "}
            {transporters.filter((t) => t.status === "Approaching Hub").length} arriving
          </p>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cargo in Transit</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Sprout size={17} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {(totalCargoInTransitKg / 1000).toFixed(1)} MT
            </span>
            <span className="text-xs font-semibold text-emerald-600">Fresh Produce</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {totalCargoInTransitKg.toLocaleString()} kg total verified payload
          </p>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cold-Chain Health</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Thermometer size={17} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">Optimal</span>
            <span className="text-xs font-bold text-sky-600">6.3°C</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            IoT Reefer continuous airflow active
          </p>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Storage Space Available</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Warehouse size={17} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {availableWarehouseMT.toLocaleString()} MT
            </span>
            <span className="text-xs font-semibold text-indigo-600">3 Hubs</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            14 docking bays open across network
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Management Control Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map (7 Cols on LG) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="h-[560px] w-full">
            <LogisticsMap
              fields={fields}
              warehouses={warehouses}
              transporters={transporters}
              selectedEntity={selectedEntity}
              onSelectEntity={handleSelectEntity}
              isLiveTrackingActive={isLiveTrackingActive}
            />
          </div>

          {/* Focused Vehicle Telemetry HUD (Quick Bar under Map) */}
          {selectedTruck && (
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/90 to-white p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-950/20">
                    <Truck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {selectedTruck.vehicleNumber}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {selectedTruck.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedTruck.originName} ➔ {selectedTruck.destinationName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">SPEED</span>
                    <strong className="text-amber-600 text-sm font-extrabold">
                      {selectedTruck.speedKmh} km/h
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">ETA</span>
                    <strong className="text-slate-900 text-sm font-extrabold">
                      ~{selectedTruck.etaMinutes} mins
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">CARGO</span>
                    <strong className="text-emerald-700 text-sm font-extrabold">
                      {selectedTruck.cargo.quantityKg.toLocaleString()} kg
                    </strong>
                  </div>
                  <a
                    href={`tel:${selectedTruck.driverPhone}`}
                    className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                  >
                    <Phone size={13} className="text-emerald-600" />
                    <span>Call Driver</span>
                  </a>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Transit Progress: {selectedTruck.routeProgressPercent}% completed</span>
                  <span>{selectedTruck.distanceRemainingKm} km remaining</span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedTruck.routeProgressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Logistics Hub Panel (5 Cols on LG) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col min-h-[560px]">
          {/* Tabs Navigation */}
          <div className="flex items-center border-b border-slate-100 pb-3 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("transporters")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "transporters"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Truck size={14} />
              <span>Transporters ({transporters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("warehouses")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "warehouses"
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Warehouse size={14} />
              <span>Warehouses ({warehouses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("fields")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "fields"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sprout size={14} />
              <span>Fields ({fields.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("alerts")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "alerts"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Activity size={14} />
              <span>Live Feed ({alerts.length})</span>
            </button>
          </div>

          {/* Tab 1: Transporters List */}
          {activeTab === "transporters" && (
            <div className="mt-4 space-y-3.5 max-h-[540px] overflow-y-auto pr-1">
              {transporters.map((truck) => {
                const isSelected = selectedEntity?.id === truck.id;
                const isReefer = truck.vehicleType.includes("Reefer");

                return (
                  <div
                    key={truck.id}
                    onClick={() => handleSelectEntity("truck", truck.id)}
                    className={`rounded-2xl border p-3.5 transition cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-50/40 shadow-sm ring-1 ring-amber-400"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                            isReefer
                              ? "bg-sky-100 text-sky-700"
                              : "bg-amber-100 text-amber-700"
                          } font-bold text-xs`}
                        >
                          <Truck size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-slate-900">
                              {truck.vehicleNumber}
                            </h4>
                            <span className="text-[10px] text-slate-400">• {truck.driverName}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{truck.vehicleType}</p>
                        </div>
                      </div>

                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          truck.status === "In Transit"
                            ? "bg-emerald-100 text-emerald-800"
                            : truck.status === "Approaching Hub"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {truck.status}
                      </span>
                    </div>

                    {/* Cargo & Route */}
                    <div className="mt-2.5 rounded-xl bg-slate-50 p-2 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Cargo Payload:</span>
                        <strong className="text-slate-800">
                          {truck.cargo.quantityKg.toLocaleString()} kg {truck.cargo.crop}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Destination:</span>
                        <span className="text-slate-700 font-semibold truncate max-w-[160px]">
                          {truck.destinationName}
                        </span>
                      </div>
                    </div>

                    {/* Telemetry Row */}
                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Compass size={14} className="text-amber-600" />
                        <span className="font-bold text-slate-800">{truck.speedKmh} km/h</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                        <Clock size={13} className="text-slate-400" />
                        <span>ETA: {truck.etaMinutes}m ({truck.distanceRemainingKm}km left)</span>
                      </div>

                      {truck.cargo.actualTempC !== undefined && (
                        <div className="flex items-center gap-1 text-sky-700 text-[11px] font-bold">
                          <Thermometer size={13} className="text-sky-600" />
                          <span>{truck.cargo.actualTempC}°C</span>
                        </div>
                      )}
                    </div>

                    {/* Route Progress */}
                    <div className="mt-2.5">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${truck.routeProgressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        GPS sync: {truck.lastGpsSync}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectEntity("truck", truck.id);
                        }}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        Track on Map <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Warehouses List */}
          {activeTab === "warehouses" && (
            <div className="mt-4 space-y-3.5 max-h-[540px] overflow-y-auto pr-1">
              {warehouses.map((wh) => {
                const isSelected = selectedEntity?.id === wh.id;

                return (
                  <div
                    key={wh.id}
                    onClick={() => handleSelectEntity("warehouse", wh.id)}
                    className={`rounded-2xl border p-3.5 transition cursor-pointer ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs">
                          <Warehouse size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{wh.name}</h4>
                          <p className="text-[11px] text-indigo-600 font-semibold">{wh.type}</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                        {wh.code}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">{wh.address}</p>

                    {/* Capacity Meter */}
                    <div className="mt-2.5 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 text-[11px]">Storage Occupancy:</span>
                        <strong className="text-slate-800">
                          {wh.occupiedCapacityMT.toLocaleString()} / {wh.totalCapacityMT.toLocaleString()} MT ({wh.utilizationPercent}%)
                        </strong>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${wh.utilizationPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg bg-slate-50 p-2">
                        <span className="text-slate-500 block text-[10px]">Chamber Temp</span>
                        <strong className="text-indigo-700 font-bold">{wh.temperatureC}°C ({wh.targetTempRange})</strong>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2">
                        <span className="text-slate-500 block text-[10px]">Unloading Bays</span>
                        <strong className="text-emerald-700 font-bold">{wh.availableBays} of {wh.totalBays} Open</strong>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">
                        📍 {wh.distanceFromFarmKm} km from farm
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDispatchModalOpen(true);
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        Dispatch Here <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Farmer Fields & Docks */}
          {activeTab === "fields" && (
            <div className="mt-4 space-y-3.5 max-h-[540px] overflow-y-auto pr-1">
              {fields.map((field) => {
                const isSelected = selectedEntity?.id === field.id;

                return (
                  <div
                    key={field.id}
                    onClick={() => handleSelectEntity("field", field.id)}
                    className={`rounded-2xl border p-3.5 transition cursor-pointer ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
                          <Sprout size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{field.name}</h4>
                          <p className="text-[11px] text-emerald-700 font-semibold">
                            {field.plotCode} • {field.areaAcres} Acres
                          </p>
                        </div>
                      </div>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {field.stage}
                      </span>
                    </div>

                    <div className="mt-2.5 rounded-xl bg-slate-50 p-2.5 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Planted Crop:</span>
                        <strong className="text-slate-800">
                          {field.crop} ({field.variety})
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ready for Dispatch:</span>
                        <strong className="text-emerald-700">
                          {field.readyForDispatchKg.toLocaleString()} kg
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Farm Dock Status:</span>
                        <span className="font-semibold text-slate-800">{field.dockStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Soil Moisture:</span>
                        <span className="font-semibold text-slate-800">
                          {field.soilMoisturePercent}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">📞 {field.gateContact}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDispatchModalOpen(true);
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        Request Pickup <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 4: Live Telemetry Alerts Feed */}
          {activeTab === "alerts" && (
            <div className="mt-4 space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 hover:bg-slate-100/80 transition"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        alt.severity === "success"
                          ? "bg-emerald-100 text-emerald-800"
                          : alt.severity === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {alt.vehicleNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">{alt.timestamp}</span>
                  </div>

                  <h5 className="mt-1.5 text-xs font-bold text-slate-900">{alt.title}</h5>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{alt.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Modal */}
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        fields={fields}
        warehouses={warehouses}
        onDispatch={handleCreateDispatch}
      />
    </div>
  );
}

export default Logistics;
