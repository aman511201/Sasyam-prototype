import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type {
  FarmerField,
  WarehouseLocation,
  TransporterVehicle,
} from "@/types/logistics";
import {
  Layers,
  Maximize2,
  Navigation,
  Warehouse,
  Sprout,
  Truck,
} from "lucide-react";

interface LogisticsMapProps {
  fields: FarmerField[];
  warehouses: WarehouseLocation[];
  transporters: TransporterVehicle[];
  selectedEntity?: {
    type: "truck" | "warehouse" | "field";
    id: string;
  } | null;
  onSelectEntity?: (
    type: "truck" | "warehouse" | "field",
    id: string
  ) => void;
  isLiveTrackingActive: boolean;
}

export function LogisticsMap({
  fields,
  warehouses,
  transporters,
  selectedEntity,
  onSelectEntity,
  isLiveTrackingActive,
}: LogisticsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups refs to easily add/remove without recreating the map
  const fieldLayerRef = useRef<L.LayerGroup | null>(null);
  const warehouseLayerRef = useRef<L.LayerGroup | null>(null);
  const transporterLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Layer visibility state
  const [showFields, setShowFields] = useState(true);
  const [showWarehouses, setShowWarehouses] = useState(true);
  const [showTransporters, setShowTransporters] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [mapStyle, setMapStyle] = useState<"voyager" | "osm" | "satellite">("voyager");

  // Keep a stable ref for onSelectEntity
  const onSelectEntityRef = useRef(onSelectEntity);
  useEffect(() => {
    onSelectEntityRef.current = onSelectEntity;
  }, [onSelectEntity]);

  // Fit all markers onto screen
  const fitAllBounds = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const allCoords: [number, number][] = [];

    fields.forEach((f) => allCoords.push(f.coordinates));
    warehouses.forEach((w) => allCoords.push(w.coordinates));
    transporters.forEach((t) => allCoords.push(t.currentLocation));

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [fields, warehouses, transporters]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center around Punjab (Ludhiana)
    const map = L.map(mapContainerRef.current, {
      center: [30.85, 75.92],
      zoom: 11,
      zoomControl: false,
    });

    // Add zoom control at bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Initial tile layer (CartoDB Voyager - clean, high performance)
    const voyagerTiles = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);
    tileLayerRef.current = voyagerTiles;

    // Initialize layer groups
    fieldLayerRef.current = L.layerGroup().addTo(map);
    warehouseLayerRef.current = L.layerGroup().addTo(map);
    transporterLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size once DOM stabilizes
    setTimeout(() => {
      map.invalidateSize();
      fitAllBounds();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [fitAllBounds]);

  // 2. Handle Map Style (Tile Layer) changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    let attribution = '&copy; OpenStreetMap contributors &copy; CARTO';

    if (mapStyle === "osm") {
      url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      attribution = '&copy; OpenStreetMap contributors';
    } else if (mapStyle === "satellite") {
      url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }

    const newLayer = L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapStyle]);

  // 3. Render Farmer Fields (Polygons + Pin Markers)
  useEffect(() => {
    const layer = fieldLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!showFields) return;

    fields.forEach((field) => {
      // Draw Field Boundary Polygon
      if (field.boundaryPolygon && field.boundaryPolygon.length > 0) {
        const polygon = L.polygon(field.boundaryPolygon, {
          color: "#059669",
          weight: 2,
          fillColor: "#10b981",
          fillOpacity: 0.25,
          dashArray: "4, 4",
        });

        polygon.bindTooltip(
          `<div class="font-bold text-xs">${field.name}</div><div class="text-[11px] text-emerald-700">${field.areaAcres} Acres • ${field.crop}</div>`,
          { sticky: true }
        );
        layer.addLayer(polygon);
      }

      // Custom Farmer Field Marker Icon
      const fieldIconHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer">
          <div class="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 ring-2 ring-white transition-transform hover:scale-110">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m0-18C8.5 7 5 10 5 14a7 7 0 0014 0c0-4-3.5-7-7-11z" />
            </svg>
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
            </span>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold tracking-wide whitespace-nowrap shadow-md border border-emerald-500/40">
            🌾 ${field.plotCode} • ${field.crop}
          </div>
        </div>
      `;

      const fieldIcon = L.divIcon({
        html: fieldIconHtml,
        className: "custom-field-marker",
        iconSize: [40, 52],
        iconAnchor: [20, 48],
      });

      const marker = L.marker(field.coordinates, { icon: fieldIcon });

      const popupHtml = `
        <div class="p-1 font-sans text-slate-800 min-w-[220px]">
          <div class="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
            <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">🌾</span>
            <div>
              <h4 class="font-bold text-xs text-slate-900 leading-tight">${field.name}</h4>
              <p class="text-[10px] text-emerald-700 font-semibold">${field.plotCode} • ${field.areaAcres} Acres</p>
            </div>
          </div>
          <div class="space-y-1.5 text-[11px]">
            <div class="flex justify-between"><span class="text-slate-500">Planted Crop:</span><strong class="text-slate-800">${field.crop} (${field.variety})</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Stage:</span><span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">${field.stage}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Ready for Dispatch:</span><strong class="text-emerald-700">${field.readyForDispatchKg.toLocaleString()} kg</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Loading Bay Status:</span><strong class="text-slate-800">${field.dockStatus}</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Soil Moisture:</span><strong class="text-slate-800">${field.soilMoisturePercent}%</strong></div>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span class="text-slate-500">📞 ${field.gateContact}</span>
            <button id="btn-focus-field-${field.id}" class="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">
              Select Field
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-focus-field-${field.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectEntityRef.current) onSelectEntityRef.current("field", field.id);
          };
        }
      });

      marker.on("click", () => {
        if (onSelectEntityRef.current) onSelectEntityRef.current("field", field.id);
      });

      layer.addLayer(marker);
    });
  }, [fields, showFields]);

  // 4. Render Warehouses & Cold Storages
  useEffect(() => {
    const layer = warehouseLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!showWarehouses) return;

    warehouses.forEach((wh) => {
      // Custom Warehouse Marker Icon
      const whIconHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer">
          <div class="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-950/40 ring-2 ring-white transition-transform hover:scale-110">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 22V12h6v10" />
            </svg>
            <span class="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-indigo-950 text-[9px] font-bold text-sky-300 ring-1 ring-white">
              ${wh.utilizationPercent}%
            </span>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold tracking-wide whitespace-nowrap shadow-md border border-indigo-400/40">
            🏬 ${wh.code}
          </div>
        </div>
      `;

      const whIcon = L.divIcon({
        html: whIconHtml,
        className: "custom-warehouse-marker",
        iconSize: [44, 54],
        iconAnchor: [22, 50],
      });

      const marker = L.marker(wh.coordinates, { icon: whIcon });

      const popupHtml = `
        <div class="p-1 font-sans text-slate-800 min-w-[230px]">
          <div class="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
            <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">🏬</span>
            <div>
              <h4 class="font-bold text-xs text-slate-900 leading-tight">${wh.name}</h4>
              <p class="text-[10px] text-indigo-600 font-semibold">${wh.type} • ${wh.distanceFromFarmKm} km from farm</p>
            </div>
          </div>
          <div class="space-y-1.5 text-[11px]">
            <div class="flex justify-between"><span class="text-slate-500">Capacity:</span><strong class="text-slate-800">${wh.occupiedCapacityMT.toLocaleString()} / ${wh.totalCapacityMT.toLocaleString()} MT (${wh.utilizationPercent}%)</strong></div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${wh.utilizationPercent}%"></div>
            </div>
            <div class="flex justify-between"><span class="text-slate-500">Chamber Temp:</span><strong class="text-indigo-600">${wh.temperatureC}°C (${wh.targetTempRange})</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Docking Bays:</span><strong class="text-emerald-700">${wh.availableBays} of ${wh.totalBays} Available</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Rental Rate:</span><strong class="text-slate-700">₹${wh.pricingPerKgPerMonth}/kg/month</strong></div>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span class="text-slate-500">📞 ${wh.managerName}</span>
            <button id="btn-focus-wh-${wh.id}" class="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">
              Select Hub
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-focus-wh-${wh.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectEntityRef.current) onSelectEntityRef.current("warehouse", wh.id);
          };
        }
      });

      marker.on("click", () => {
        if (onSelectEntityRef.current) onSelectEntityRef.current("warehouse", wh.id);
      });

      layer.addLayer(marker);
    });
  }, [warehouses, showWarehouses]);

  // 5. Render Transporters & Route Polylines
  useEffect(() => {
    const tLayer = transporterLayerRef.current;
    const rLayer = routeLayerRef.current;
    if (!tLayer || !rLayer) return;

    tLayer.clearLayers();
    rLayer.clearLayers();

    // Draw Routes if enabled
    if (showRoutes) {
      transporters.forEach((truck, idx) => {
        if (!truck.routeCoordinates || truck.routeCoordinates.length < 2) return;

        const routeColors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"];
        const color = routeColors[idx % routeColors.length];

        // Route line
        const polyline = L.polyline(truck.routeCoordinates, {
          color: color,
          weight: 4,
          opacity: 0.75,
          dashArray: "6, 8",
        });

        polyline.bindTooltip(
          `<div class="font-bold text-[11px]">${truck.vehicleNumber}</div><div class="text-[10px]">${truck.originName} ➔ ${truck.destinationName}</div>`,
          { sticky: true }
        );

        rLayer.addLayer(polyline);
      });
    }

    // Draw Transporters if enabled
    if (showTransporters) {
      transporters.forEach((truck) => {
        const isSelected = selectedEntity?.type === "truck" && selectedEntity?.id === truck.id;
        const isReefer = truck.vehicleType.includes("Reefer");

        // Transporter Vehicle Pin HTML with dynamic speed & badge
        const truckIconHtml = `
          <div class="relative flex flex-col items-center group cursor-pointer">
            <div class="relative flex items-center justify-center w-10 h-10 rounded-2xl ${
              isSelected
                ? "bg-amber-500 ring-4 ring-amber-300 scale-115 shadow-xl shadow-amber-950/50"
                : isReefer
                ? "bg-sky-600 ring-2 ring-white shadow-lg shadow-sky-950/40"
                : "bg-amber-600 ring-2 ring-white shadow-lg shadow-amber-950/40"
            } text-white transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h2a1 1 0 001-1" />
              </svg>
              ${
                isLiveTrackingActive
                  ? `<span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${
                        isReefer ? "bg-sky-400" : "bg-amber-400"
                      } opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3.5 w-3.5 ${
                        isReefer ? "bg-sky-300" : "bg-amber-300"
                      }"></span>
                    </span>`
                  : ""
              }
            </div>
            <div class="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/95 text-white text-[10px] font-bold tracking-wide whitespace-nowrap shadow-md border ${
              isSelected ? "border-amber-400 ring-1 ring-amber-400" : "border-slate-700"
            }">
              <span>🚚 ${truck.vehicleNumber}</span>
              <span class="text-amber-400 font-extrabold">• ${truck.speedKmh} km/h</span>
            </div>
          </div>
        `;

        const truckIcon = L.divIcon({
          html: truckIconHtml,
          className: "custom-transporter-marker",
          iconSize: [48, 54],
          iconAnchor: [24, 50],
        });

        const marker = L.marker(truck.currentLocation, { icon: truckIcon });

        const popupHtml = `
          <div class="p-1 font-sans text-slate-800 min-w-[240px]">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
              <div class="flex items-center gap-2">
                <span class="flex h-7 w-7 items-center justify-center rounded-lg ${
                  isReefer ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700"
                } font-bold text-xs">🚚</span>
                <div>
                  <h4 class="font-bold text-xs text-slate-900 leading-tight">${truck.vehicleNumber}</h4>
                  <p class="text-[10px] text-slate-500 font-medium">${truck.vehicleType}</p>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${
                truck.status === "In Transit"
                  ? "bg-emerald-100 text-emerald-800"
                  : truck.status === "Approaching Hub"
                  ? "bg-sky-100 text-sky-800"
                  : "bg-amber-100 text-amber-800"
              }">
                ${truck.status}
              </span>
            </div>

            <div class="space-y-1.5 text-[11px]">
              <div class="flex justify-between"><span class="text-slate-500">Cargo:</span><strong class="text-slate-900">${truck.cargo.quantityKg.toLocaleString()} kg ${truck.cargo.crop}</strong></div>
              <div class="flex justify-between"><span class="text-slate-500">Route:</span><span class="text-slate-700 truncate max-w-[150px] font-medium">${truck.originName} ➔ ${truck.destinationName}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Live Speed:</span><strong class="text-amber-600 font-bold">${truck.speedKmh} km/h</strong></div>
              <div class="flex justify-between"><span class="text-slate-500">ETA / Distance:</span><strong class="text-slate-800">${truck.etaMinutes} mins (${truck.distanceRemainingKm} km left)</strong></div>
              ${
                truck.cargo.actualTempC !== undefined
                  ? `<div class="flex justify-between bg-sky-50 px-1.5 py-0.5 rounded text-sky-900">
                      <span>Reefer Temp:</span>
                      <strong class="font-bold text-sky-700">${truck.cargo.actualTempC}°C (Target ${truck.cargo.targetTempC}°C)</strong>
                    </div>`
                  : ""
              }
              <div class="flex justify-between"><span class="text-slate-500">Geofence:</span><span class="text-slate-600 text-[10px] font-medium">${truck.geofenceStatus}</span></div>
            </div>

            <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span class="text-slate-500">Driver: ${truck.driverName}</span>
              <button id="btn-focus-truck-${truck.id}" class="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold transition">
                Focus Telemetry
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml, { maxWidth: 300 });

        marker.on("popupopen", () => {
          const btn = document.getElementById(`btn-focus-truck-${truck.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectEntityRef.current) onSelectEntityRef.current("truck", truck.id);
            };
          }
        });

        marker.on("click", () => {
          if (onSelectEntityRef.current) onSelectEntityRef.current("truck", truck.id);
        });

        tLayer.addLayer(marker);
      });
    }
  }, [
    transporters,
    showTransporters,
    showRoutes,
    selectedEntity,
    isLiveTrackingActive,
  ]);

  // 6. Fly to selected entity when user clicks it from lists/cards
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedEntity) return;

    if (selectedEntity.type === "truck") {
      const truck = transporters.find((t) => t.id === selectedEntity.id);
      if (truck) {
        mapInstanceRef.current.flyTo(truck.currentLocation, 14, { duration: 1.2 });
      }
    } else if (selectedEntity.type === "warehouse") {
      const wh = warehouses.find((w) => w.id === selectedEntity.id);
      if (wh) {
        mapInstanceRef.current.flyTo(wh.coordinates, 14, { duration: 1.2 });
      }
    } else if (selectedEntity.type === "field") {
      const field = fields.find((f) => f.id === selectedEntity.id);
      if (field) {
        mapInstanceRef.current.flyTo(field.coordinates, 14, { duration: 1.2 });
      }
    }
  }, [selectedEntity, transporters, warehouses, fields]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top Bar Controls */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto flex flex-wrap items-center gap-2 z-10 pointer-events-auto">
        {/* Layer Visibility Toggles */}
        <div className="flex items-center gap-1 rounded-xl bg-white/95 px-2.5 py-1.5 shadow-md border border-slate-200/90 backdrop-blur text-xs font-medium text-slate-700">
          <Layers size={14} className="text-slate-400 mr-1" />
          <button
            onClick={() => setShowTransporters(!showTransporters)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
              showTransporters
                ? "bg-amber-100 text-amber-900 font-bold"
                : "text-slate-400 hover:bg-slate-100"
            }`}
            title="Toggle Transporters"
          >
            <Truck size={13} />
            <span>Vehicles ({transporters.length})</span>
          </button>

          <button
            onClick={() => setShowWarehouses(!showWarehouses)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
              showWarehouses
                ? "bg-indigo-100 text-indigo-900 font-bold"
                : "text-slate-400 hover:bg-slate-100"
            }`}
            title="Toggle Warehouses"
          >
            <Warehouse size={13} />
            <span>Hubs ({warehouses.length})</span>
          </button>

          <button
            onClick={() => setShowFields(!showFields)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
              showFields
                ? "bg-emerald-100 text-emerald-900 font-bold"
                : "text-slate-400 hover:bg-slate-100"
            }`}
            title="Toggle Farmer Fields"
          >
            <Sprout size={13} />
            <span>Fields ({fields.length})</span>
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
              showRoutes
                ? "bg-slate-200 text-slate-800 font-bold"
                : "text-slate-400 hover:bg-slate-100"
            }`}
            title="Toggle Route Paths"
          >
            <Navigation size={13} />
            <span className="hidden sm:inline">Routes</span>
          </button>
        </div>

        {/* Map Style Selector */}
        <div className="flex items-center rounded-xl bg-white/95 p-1 shadow-md border border-slate-200/90 backdrop-blur text-xs">
          <button
            onClick={() => setMapStyle("voyager")}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              mapStyle === "voyager"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Logistics
          </button>
          <button
            onClick={() => setMapStyle("osm")}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              mapStyle === "osm"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Streets
          </button>
          <button
            onClick={() => setMapStyle("satellite")}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              mapStyle === "satellite"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Reset / Fit View Button */}
        <button
          onClick={fitAllBounds}
          className="flex items-center gap-1 rounded-xl bg-white/95 px-2.5 py-1.5 shadow-md border border-slate-200/90 backdrop-blur text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          title="Fit All on Map"
        >
          <Maximize2 size={13} className="text-slate-500" />
          <span className="hidden sm:inline">Fit All</span>
        </button>
      </div>

      {/* Floating Bottom Left: Live Stream Indicator */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 px-3 py-1.5 shadow-lg border border-slate-700 text-white backdrop-blur text-xs">
          <span className="relative flex h-2.5 w-2.5">
            {isLiveTrackingActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isLiveTrackingActive ? "bg-emerald-500" : "bg-amber-400"
              }`}
            ></span>
          </span>
          <span className="font-semibold">
            {isLiveTrackingActive ? "GPS Telemetry Live" : "Tracking Paused"}
          </span>
          <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">
            3 Active Transponders
          </span>
        </div>
      </div>

      {/* Floating Bottom Center/Right: Map Legend */}
      <div className="hidden md:flex absolute bottom-3 right-16 z-10 pointer-events-auto items-center gap-3 rounded-xl bg-white/90 px-3 py-1.5 shadow-md border border-slate-200 text-[11px] font-semibold text-slate-700 backdrop-blur">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Farmer Fields</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span>Warehouses / Silos</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Live Vehicles</span>
        </div>
      </div>
    </div>
  );
}

export default LogisticsMap;
