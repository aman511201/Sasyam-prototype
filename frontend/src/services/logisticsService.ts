import type {
  FarmerField,
  WarehouseLocation,
  TransporterVehicle,
  LogisticsTelemetryAlert,
  NewDispatchRequest,
} from "@/types/logistics";

// 1. Farmer Field Locations (Ramesh Kumar's Farms around Ludhiana, Punjab)
export const INITIAL_FARMER_FIELDS: FarmerField[] = [
  {
    id: "field-plot-b",
    name: "Ramesh Estate - Plot B (Tomatoes)",
    plotCode: "PLOT-PB-02",
    crop: "Tomato",
    variety: "Abhinav Hybrid",
    areaAcres: 3.2,
    coordinates: [30.841, 75.991],
    boundaryPolygon: [
      [30.844, 75.987],
      [30.8445, 75.995],
      [30.838, 75.996],
      [30.8375, 75.988],
    ],
    stage: "Harvest Ready",
    currentYieldKg: 4200,
    readyForDispatchKg: 4200,
    dockStatus: "Loading",
    gateContact: "+91 98765-11001",
    soilMoisturePercent: 68,
    address: "Village Sahnewal Khurd, Ludhiana Rural, Punjab",
  },
  {
    id: "field-plot-a",
    name: "Ramesh Estate - Plot A (Sharbati Wheat)",
    plotCode: "PLOT-PB-01",
    crop: "Wheat",
    variety: "PBW 550 / Sharbati",
    areaAcres: 4.5,
    coordinates: [30.8245, 75.972],
    boundaryPolygon: [
      [30.827, 75.968],
      [30.828, 75.976],
      [30.821, 75.977],
      [30.82, 75.969],
    ],
    stage: "Active Maturation",
    currentYieldKg: 9800,
    readyForDispatchKg: 1200,
    dockStatus: "Idle",
    gateContact: "+91 98765-11002",
    soilMoisturePercent: 62,
    address: "GT Link Road, Near Samrala Bypass, Ludhiana, Punjab",
  },
  {
    id: "field-plot-c",
    name: "Ramesh Canal Estate - Plot C (Basmati Rice)",
    plotCode: "PLOT-PB-03",
    crop: "Basmati Rice",
    variety: "Pusa 1121 Export",
    areaAcres: 3.8,
    coordinates: [30.801, 75.945],
    boundaryPolygon: [
      [30.804, 75.941],
      [30.805, 75.949],
      [30.797, 75.95],
      [30.796, 75.942],
    ],
    stage: "Harvest Ready",
    currentYieldKg: 12500,
    readyForDispatchKg: 12500,
    dockStatus: "Bay Open",
    gateContact: "+91 98765-11003",
    soilMoisturePercent: 74,
    address: "Sirhind Canal Road, Doraha Sector, Ludhiana District, Punjab",
  },
];

// 2. Warehouses & Cold Storages in the Regional Agro Network
export const INITIAL_WAREHOUSES: WarehouseLocation[] = [
  {
    id: "wh-ludhiana-cold",
    name: "Ludhiana Central AgroCold & CA Hub",
    code: "WH-LDH-01",
    type: "Cold Storage & CA",
    coordinates: [30.9125, 75.882],
    totalCapacityMT: 5000,
    occupiedCapacityMT: 3900,
    utilizationPercent: 78,
    temperatureC: 4.8,
    targetTempRange: "2°C to 8°C",
    humidityPercent: 90,
    availableBays: 4,
    totalBays: 12,
    managerName: "Sandeep Varma",
    contactPhone: "+91 98711-22334",
    address: "Plot 42, Focal Point Phase V, Ludhiana, Punjab",
    distanceFromFarmKm: 14.8,
    supportedCrops: ["Tomato", "Potato", "Fruits", "Green Vegetables"],
    pricingPerKgPerMonth: 1.25,
    status: "Operational",
  },
  {
    id: "wh-khanna-silo",
    name: "Khanna Agro Logistics & Silo Complex",
    code: "WH-KHN-02",
    type: "Grain Silo Hub",
    coordinates: [30.705, 76.218],
    totalCapacityMT: 25000,
    occupiedCapacityMT: 19800,
    utilizationPercent: 79,
    temperatureC: 17.5,
    targetTempRange: "15°C to 20°C",
    humidityPercent: 52,
    availableBays: 8,
    totalBays: 24,
    managerName: "Kuldeep Dhillon",
    contactPhone: "+91 98155-44221",
    address: "Near Asia's Largest Grain Market, GT Road, Khanna, Punjab",
    distanceFromFarmKm: 28.4,
    supportedCrops: ["Wheat", "Basmati Rice", "Paddy", "Maize", "Pulses"],
    pricingPerKgPerMonth: 0.65,
    status: "Operational",
  },
  {
    id: "wh-jalandhar-terminal",
    name: "Jalandhar Cold Chain & Processing Terminal",
    code: "WH-JAL-03",
    type: "Agro-Processing & Terminal",
    coordinates: [31.312, 75.602],
    totalCapacityMT: 8000,
    occupiedCapacityMT: 7100,
    utilizationPercent: 89,
    temperatureC: 2.5,
    targetTempRange: "0°C to 5°C",
    humidityPercent: 88,
    availableBays: 2,
    totalBays: 10,
    managerName: "Gurdas Gill",
    contactPhone: "+91 98223-99881",
    address: "Amritsar-Delhi Bypass, Transport Nagar, Jalandhar, Punjab",
    distanceFromFarmKm: 62.0,
    supportedCrops: ["Green Chillies", "Tomato", "Peas", "Export Fresh Produce"],
    pricingPerKgPerMonth: 1.45,
    status: "High Demand",
  },
];

// Waypoint Route 1: Ramesh Farm Plot B (Tomatoes) -> Ludhiana Central AgroCold Hub (12 waypoints)
const ROUTE_FARM_B_TO_LUDHIANA: [number, number][] = [
  [30.841, 75.991],   // Origin Farm Plot B
  [30.847, 75.975],   // Sahnewal rural link
  [30.854, 75.958],   // Approaching NH-5 GT Road
  [30.862, 75.942],   // Sahnewal Flyover
  [30.871, 75.928],   // Ludhiana East Ring Link
  [30.88, 75.915],    // Dhandari Kalan Bridge
  [30.889, 75.903],   // Giaspura Junction
  [30.898, 75.895],   // Cheema Chowk Approach
  [30.906, 75.888],   // Focal Point Phase V Gate
  [30.9125, 75.882],  // Destination Warehouse
];

// Waypoint Route 2: Ramesh Farm Plot C (Rice) -> Khanna Agro Logistics & Silo Hub (12 waypoints)
const ROUTE_FARM_C_TO_KHANNA: [number, number][] = [
  [30.801, 75.945],   // Origin Farm Plot C
  [30.792, 75.962],   // Doraha Canal Crossing
  [30.781, 75.986],   // Doraha Toll Plaza NH-44
  [30.768, 76.025],   // NH-44 Highway Eastbound
  [30.755, 76.068],   // Beeja Link Turn
  [30.742, 76.115],   // GT Road stretch
  [30.73, 76.155],    // Near Khanna Industrial Area
  [30.718, 76.185],   // Khanna City Bypass
  [30.711, 76.205],   // Mandi Gate North
  [30.705, 76.218],   // Destination Khanna Silo Hub
];

// Waypoint Route 3: Jalandhar Terminal -> Ramesh Farm Plot A (Returning for next batch)
const ROUTE_JALANDHAR_TO_FARM_A: [number, number][] = [
  [31.312, 75.602],   // Jalandhar Terminal
  [31.258, 75.642],   // Phagwara Road NH-44
  [31.215, 75.688],   // Phagwara Bypass
  [31.145, 75.735],   // Phillaur Bridge (Sutlej River)
  [31.062, 75.782],   // Ludhiana North Inflow
  [30.975, 75.835],   // Samrala Bypass Link
  [30.902, 75.898],   // Sahnewal Connector
  [30.855, 75.945],   // Farm approach road
  [30.8245, 75.972],  // Destination Farm Plot A
];

// 3. Initial Active Transporters on the Map
export const INITIAL_TRANSPORTERS: TransporterVehicle[] = [
  {
    id: "trk-01",
    vehicleNumber: "PB-10-CZ-4412",
    vehicleType: "Reefer Van (Cold Chain)",
    driverName: "Gurpreet Singh",
    driverPhone: "+91 98765-43210",
    currentLocation: ROUTE_FARM_B_TO_LUDHIANA[4], // Mid-route
    speedKmh: 46,
    headingDeg: 310,
    status: "In Transit",
    cargo: {
      batchCode: "BATCH-TM-2026-04",
      crop: "Tomato",
      variety: "Abhinav Hybrid",
      quantityKg: 4200,
      targetTempC: 6.0,
      actualTempC: 6.3,
      tempStatus: "normal",
      grade: "Grade A",
    },
    originFieldId: "field-plot-b",
    originName: "Ramesh Estate - Plot B",
    destinationWarehouseId: "wh-ludhiana-cold",
    destinationName: "Ludhiana Central AgroCold Hub",
    routeCoordinates: ROUTE_FARM_B_TO_LUDHIANA,
    currentRouteIndex: 4,
    routeProgressPercent: 48,
    etaMinutes: 16,
    distanceRemainingKm: 7.6,
    totalDistanceKm: 14.8,
    fuelPercent: 82,
    lastGpsSync: "Just now",
    geofenceStatus: "On Highway NH-44",
  },
  {
    id: "trk-02",
    vehicleNumber: "PB-08-BK-8901",
    vehicleType: "Heavy Flatbed (16-Wheeler)",
    driverName: "Harjit Mand",
    driverPhone: "+91 98123-77441",
    currentLocation: ROUTE_FARM_C_TO_KHANNA[6], // Near destination
    speedKmh: 38,
    headingDeg: 125,
    status: "Approaching Hub",
    cargo: {
      batchCode: "BATCH-RC-2025-11",
      crop: "Basmati Rice",
      variety: "Pusa 1121",
      quantityKg: 12500,
      grade: "Grade A+",
    },
    originFieldId: "field-plot-c",
    originName: "Ramesh Canal Estate - Plot C",
    destinationWarehouseId: "wh-khanna-silo",
    destinationName: "Khanna Agro Logistics & Silo Hub",
    routeCoordinates: ROUTE_FARM_C_TO_KHANNA,
    currentRouteIndex: 6,
    routeProgressPercent: 72,
    etaMinutes: 11,
    distanceRemainingKm: 6.9,
    totalDistanceKm: 28.4,
    fuelPercent: 64,
    lastGpsSync: "2s ago",
    geofenceStatus: "Near Ludhiana Bypass",
  },
  {
    id: "trk-03",
    vehicleNumber: "PB-11-AX-9920",
    vehicleType: "Mahindra Bolero Maxi",
    driverName: "Sukhwinder Deep",
    driverPhone: "+91 98450-11223",
    currentLocation: ROUTE_JALANDHAR_TO_FARM_A[3],
    speedKmh: 54,
    headingDeg: 150,
    status: "Returning",
    cargo: {
      batchCode: "DISP-RET-09",
      crop: "Empty Container Trays",
      variety: "Cleaned Crates for Chillies",
      quantityKg: 350,
      grade: "Grade A",
    },
    originFieldId: "wh-jalandhar-terminal",
    originName: "Jalandhar Cold Chain Terminal",
    destinationWarehouseId: "field-plot-a",
    destinationName: "Ramesh Estate - Plot A (Farm Gate)",
    routeCoordinates: ROUTE_JALANDHAR_TO_FARM_A,
    currentRouteIndex: 3,
    routeProgressPercent: 38,
    etaMinutes: 38,
    distanceRemainingKm: 34.2,
    totalDistanceKm: 62.0,
    fuelPercent: 74,
    lastGpsSync: "1s ago",
    geofenceStatus: "On Highway NH-44",
  },
];

// Initial Telemetry Alerts Feed
export const INITIAL_TELEMETRY_ALERTS: LogisticsTelemetryAlert[] = [
  {
    id: "alt-01",
    timestamp: "12:44 PM",
    vehicleId: "trk-01",
    vehicleNumber: "PB-10-CZ-4412",
    type: "cold-chain",
    severity: "success",
    title: "Cold Chain Sensor Verified",
    message: "Reefer temperature steady at 6.3°C (target 6.0°C). Airflow active in Cargo Bay #1.",
  },
  {
    id: "alt-02",
    timestamp: "12:41 PM",
    vehicleId: "trk-02",
    vehicleNumber: "PB-08-BK-8901",
    type: "geofence",
    severity: "info",
    title: "Entered Khanna Approach Zone",
    message: "Transporter entered 10km perimeter of Khanna Agro Silo Complex. Unloading Bay #5 reserved.",
  },
  {
    id: "alt-03",
    timestamp: "12:35 PM",
    vehicleId: "trk-03",
    vehicleNumber: "PB-11-AX-9920",
    type: "speed",
    severity: "info",
    title: "Sutlej River Bridge Crossed",
    message: "Passing Phillaur bypass on NH-44 at 54 km/h. Expected at Farm Gate in ~38 mins.",
  },
  {
    id: "alt-04",
    timestamp: "12:15 PM",
    vehicleId: "trk-01",
    vehicleNumber: "PB-10-CZ-4412",
    type: "dispatch",
    severity: "info",
    title: "Dispatched from Ramesh Farm Plot B",
    message: "4,200 kg Tomatoes loaded with e-Way Bill #EW-982312. Weight slip verified.",
  },
];

// Helper: Calculate distance between two lat/lng in KM (Haversine formula)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Step Simulation for vehicles
export function stepTransporterSimulation(
  transporters: TransporterVehicle[],
  alerts: LogisticsTelemetryAlert[]
): {
  updatedTransporters: TransporterVehicle[];
  newAlerts: LogisticsTelemetryAlert[];
} {
  const newAlerts: LogisticsTelemetryAlert[] = [...alerts];

  const updatedTransporters = transporters.map((truck) => {
    const route = truck.routeCoordinates;
    if (!route || route.length === 0) return truck;

    let nextIndex = truck.currentRouteIndex + 1;

    // If reached end of route, restart or loop back realistically
    if (nextIndex >= route.length) {
      nextIndex = 0; // In demo simulation, loop smoothly
    }

    const newLocation = route[nextIndex];
    const prevLocation = truck.currentLocation;

    // Compute heading angle
    const dy = newLocation[0] - prevLocation[0];
    const dx = newLocation[1] - prevLocation[1];
    const headingDeg = Math.round((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;

    // Slight realistic speed fluctuation
    const speedVariation = Math.floor(Math.random() * 7) - 3;
    const speedKmh = Math.max(30, Math.min(65, truck.speedKmh + speedVariation));

    // Progress percentage
    const routeProgressPercent = Math.round((nextIndex / (route.length - 1)) * 100);

    // Distance remaining
    const remainingSteps = route.length - 1 - nextIndex;
    const distanceRemainingKm = Math.max(
      0.5,
      parseFloat(((remainingSteps / (route.length - 1)) * truck.totalDistanceKm).toFixed(1))
    );

    // ETA recalculation based on speed
    const etaMinutes = Math.max(2, Math.round((distanceRemainingKm / speedKmh) * 60));

    // Reefer temperature simulation (for cold chain truck)
    let actualTemp = truck.cargo.actualTempC;
    let tempStatus = truck.cargo.tempStatus;
    if (actualTemp !== undefined && truck.cargo.targetTempC !== undefined) {
      const tempDelta = (Math.random() * 0.4 - 0.2);
      actualTemp = parseFloat((actualTemp + tempDelta).toFixed(1));
      if (Math.abs(actualTemp - truck.cargo.targetTempC) > 2.5) {
        tempStatus = "warning";
      } else {
        tempStatus = "normal";
      }
    }

    // Geofence status update
    let geofenceStatus = truck.geofenceStatus;
    let status = truck.status;
    if (routeProgressPercent > 85) {
      geofenceStatus = "Arrived at Hub Gate";
      status = "Approaching Hub";
    } else if (routeProgressPercent < 15) {
      geofenceStatus = "Inside Farm Gate";
      status = "In Transit";
    } else {
      geofenceStatus = "On Highway NH-44";
      status = "In Transit";
    }

    // Trigger occasional alert
    if (Math.random() < 0.2) {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (truck.vehicleType.includes("Reefer")) {
        newAlerts.unshift({
          id: `alt-${Date.now()}-${truck.id}`,
          timestamp: timeStr,
          vehicleId: truck.id,
          vehicleNumber: truck.vehicleNumber,
          type: "cold-chain",
          severity: "success",
          title: "Cold Chain Telemetry Check",
          message: `${truck.vehicleNumber}: Cargo hold temp ${actualTemp}°C. Target ${truck.cargo.targetTempC}°C verified safe.`,
        });
      } else {
        newAlerts.unshift({
          id: `alt-${Date.now()}-${truck.id}`,
          timestamp: timeStr,
          vehicleId: truck.id,
          vehicleNumber: truck.vehicleNumber,
          type: "geofence",
          severity: "info",
          title: "GPS Waypoint Reached",
          message: `${truck.vehicleNumber} moving at ${speedKmh} km/h towards ${truck.destinationName}. ETA ${etaMinutes}m.`,
        });
      }
    }

    return {
      ...truck,
      currentLocation: newLocation,
      currentRouteIndex: nextIndex,
      headingDeg,
      speedKmh,
      routeProgressPercent,
      distanceRemainingKm,
      etaMinutes,
      status,
      geofenceStatus,
      fuelPercent: Math.max(20, truck.fuelPercent - 0.1),
      lastGpsSync: "Just now",
      cargo: {
        ...truck.cargo,
        actualTempC: actualTemp,
        tempStatus,
      },
    };
  });

  return {
    updatedTransporters,
    newAlerts: newAlerts.slice(0, 15), // keep latest 15 alerts
  };
}

// Optional: Fetch real turn-by-turn road waypoints if VITE_OPENROUTESERVICE_API_KEY is configured
export async function fetchLiveRoadRoute(
  start: [number, number],
  end: [number, number]
): Promise<[number, number][] | null> {
  const orsApiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
  if (!orsApiKey) return null;

  try {
    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-hgv?api_key=${orsApiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const coordinates = data.features?.[0]?.geometry?.coordinates;
    if (Array.isArray(coordinates)) {
      // OpenRouteService returns [lng, lat], Leaflet expects [lat, lng]
      return coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
    }
  } catch (err) {
    console.warn("OpenRouteService API call failed, using regional highway path:", err);
  }
  return null;
}

// Optional: Sync with FastAPI backend if VITE_API_BASE_URL is running
export async function fetchBackendLogisticsOverview() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${baseUrl}/api/logistics/overview`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend server offline, gracefully continue with local state
  }
  return null;
}

// Create a new dispatch / book transporter
export function createNewDispatch(
  request: NewDispatchRequest,
  fields: FarmerField[],
  warehouses: WarehouseLocation[]
): TransporterVehicle {
  const originField = fields.find((f) => f.id === request.originFieldId) || fields[0];
  const destWarehouse = warehouses.find((w) => w.id === request.destinationWarehouseId) || warehouses[0];

  // Calculate route interpolation
  const [lat1, lon1] = originField.coordinates;
  const [lat2, lon2] = destWarehouse.coordinates;

  const totalDist = calculateDistanceKm(lat1, lon1, lat2, lon2) * 1.25; // road multiplier ~1.25
  const steps = 10;
  const generatedRoute: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    // Add slight natural road wiggle
    const curveOffset = Math.sin(fraction * Math.PI) * 0.015;
    const pointLat = lat1 + (lat2 - lat1) * fraction + curveOffset;
    const pointLon = lon1 + (lon2 - lon1) * fraction - curveOffset * 0.5;
    generatedRoute.push([
      parseFloat(pointLat.toFixed(5)),
      parseFloat(pointLon.toFixed(5)),
    ]);
  }

  const newId = `trk-${Date.now().toString().slice(-4)}`;
  const avgSpeed = request.vehicleType.includes("Heavy") ? 40 : 50;
  const etaMins = Math.round((totalDist / avgSpeed) * 60);

  const newVehicle: TransporterVehicle = {
    id: newId,
    vehicleNumber: request.vehicleNumber.toUpperCase(),
    vehicleType: request.vehicleType,
    driverName: request.driverName,
    driverPhone: request.driverPhone,
    currentLocation: generatedRoute[0],
    speedKmh: avgSpeed,
    headingDeg: 45,
    status: "Loading at Farm",
    cargo: {
      batchCode: request.cropBatchCode,
      crop: request.crop,
      variety: request.variety,
      quantityKg: request.quantityKg,
      targetTempC: request.targetTempC ?? 5.5,
      actualTempC: request.targetTempC ?? 5.5,
      tempStatus: "normal",
      grade: "Grade A",
    },
    originFieldId: originField.id,
    originName: originField.name,
    destinationWarehouseId: destWarehouse.id,
    destinationName: destWarehouse.name,
    routeCoordinates: generatedRoute,
    currentRouteIndex: 0,
    routeProgressPercent: 0,
    etaMinutes: etaMins,
    distanceRemainingKm: parseFloat(totalDist.toFixed(1)),
    totalDistanceKm: parseFloat(totalDist.toFixed(1)),
    fuelPercent: 95,
    lastGpsSync: "Just now",
    geofenceStatus: "Inside Farm Gate",
  };

  return newVehicle;
}
