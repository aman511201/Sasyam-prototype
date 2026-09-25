export interface FarmerField {
  id: string;
  name: string;
  plotCode: string;
  crop: string;
  variety: string;
  areaAcres: number;
  coordinates: [number, number]; // [lat, lng]
  boundaryPolygon: [number, number][]; // array of [lat, lng]
  stage: "Harvest Ready" | "Active Maturation" | "Post-Harvest Prepared";
  currentYieldKg: number;
  readyForDispatchKg: number;
  dockStatus: "Bay Open" | "Loading" | "Idle";
  gateContact: string;
  soilMoisturePercent: number;
  address: string;
}

export interface WarehouseLocation {
  id: string;
  name: string;
  code: string;
  type: "Cold Storage & CA" | "Grain Silo Hub" | "Agro-Processing & Terminal";
  coordinates: [number, number]; // [lat, lng]
  totalCapacityMT: number;
  occupiedCapacityMT: number;
  utilizationPercent: number;
  temperatureC: number;
  targetTempRange: string;
  humidityPercent: number;
  availableBays: number;
  totalBays: number;
  managerName: string;
  contactPhone: string;
  address: string;
  distanceFromFarmKm: number;
  supportedCrops: string[];
  pricingPerKgPerMonth: number;
  status: "Operational" | "High Demand" | "Full";
}

export type TransporterStatus =
  | "In Transit"
  | "Approaching Hub"
  | "Loading at Farm"
  | "Unloading"
  | "Returning"
  | "Completed";

export interface TransporterCargo {
  batchCode: string;
  crop: string;
  variety: string;
  quantityKg: number;
  targetTempC?: number;
  actualTempC?: number;
  tempStatus?: "normal" | "warning" | "critical";
  grade: "Grade A+" | "Grade A" | "Grade B";
}

export interface TransporterVehicle {
  id: string;
  vehicleNumber: string; // e.g. "PB-10-CZ-4412"
  vehicleType: "Reefer Van (Cold Chain)" | "Heavy Flatbed (16-Wheeler)" | "Mahindra Bolero Maxi";
  driverName: string;
  driverPhone: string;
  currentLocation: [number, number]; // [lat, lng]
  speedKmh: number;
  headingDeg: number;
  status: TransporterStatus;
  cargo: TransporterCargo;
  originFieldId: string;
  originName: string;
  destinationWarehouseId: string;
  destinationName: string;
  routeCoordinates: [number, number][]; // Full route waypoints
  currentRouteIndex: number; // Current waypoint index in simulation
  routeProgressPercent: number;
  etaMinutes: number;
  distanceRemainingKm: number;
  totalDistanceKm: number;
  fuelPercent: number;
  lastGpsSync: string;
  geofenceStatus: "Inside Farm Gate" | "On Highway NH-44" | "Near Ludhiana Bypass" | "Arrived at Hub Gate";
}

export interface LogisticsTelemetryAlert {
  id: string;
  timestamp: string;
  vehicleId: string;
  vehicleNumber: string;
  type: "cold-chain" | "geofence" | "speed" | "dispatch" | "delivered";
  severity: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
}

export interface NewDispatchRequest {
  originFieldId: string;
  destinationWarehouseId: string;
  cropBatchCode: string;
  crop: string;
  variety: string;
  quantityKg: number;
  vehicleType: "Reefer Van (Cold Chain)" | "Heavy Flatbed (16-Wheeler)" | "Mahindra Bolero Maxi";
  targetTempC?: number;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
}
