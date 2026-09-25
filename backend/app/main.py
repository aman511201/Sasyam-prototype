from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(
    title="Sasyam Agri-Platform API",
    description="AI-powered agriculture decision and logistics tracking platform",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Sasyam API is running",
        "modules": ["crops", "decision-engine", "logistics", "weather", "market"]
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time()
    }


# Models for Logistics
class CargoItem(BaseModel):
    batch_code: str
    crop: str
    variety: str
    quantity_kg: float
    grade: str
    target_temp_c: Optional[float] = None
    actual_temp_c: Optional[float] = None


class Transporter(BaseModel):
    id: str
    vehicle_number: str
    vehicle_type: str
    driver_name: str
    driver_phone: str
    latitude: float
    longitude: float
    speed_kmh: float
    status: str
    cargo: CargoItem
    origin_name: str
    destination_name: str
    eta_minutes: int
    distance_remaining_km: float


class Warehouse(BaseModel):
    id: str
    name: str
    code: str
    type: str
    latitude: float
    longitude: float
    total_capacity_mt: int
    occupied_capacity_mt: int
    temperature_c: float
    humidity_percent: int
    available_bays: int
    manager_name: str
    distance_km: float


class FarmerField(BaseModel):
    id: str
    name: str
    plot_code: str
    crop: str
    area_acres: float
    latitude: float
    longitude: float
    stage: str
    ready_for_dispatch_kg: int
    dock_status: str


class DispatchRequest(BaseModel):
    origin_field_id: str
    destination_warehouse_id: str
    crop_batch_code: str
    crop: str
    variety: str
    quantity_kg: float
    vehicle_type: str
    target_temp_c: Optional[float] = 5.5
    driver_name: str
    driver_phone: str
    vehicle_number: str


# Static regional logistics data
SAMPLE_FIELDS = [
    {
        "id": "field-plot-b",
        "name": "Ramesh Estate - Plot B (Tomatoes)",
        "plot_code": "PLOT-PB-02",
        "crop": "Tomato",
        "area_acres": 3.2,
        "latitude": 30.841,
        "longitude": 75.991,
        "stage": "Harvest Ready",
        "ready_for_dispatch_kg": 4200,
        "dock_status": "Loading",
    },
    {
        "id": "field-plot-a",
        "name": "Ramesh Estate - Plot A (Sharbati Wheat)",
        "plot_code": "PLOT-PB-01",
        "crop": "Wheat",
        "area_acres": 4.5,
        "latitude": 30.8245,
        "longitude": 75.972,
        "stage": "Active Maturation",
        "ready_for_dispatch_kg": 1200,
        "dock_status": "Idle",
    },
    {
        "id": "field-plot-c",
        "name": "Ramesh Canal Estate - Plot C (Basmati Rice)",
        "plot_code": "PLOT-PB-03",
        "crop": "Basmati Rice",
        "area_acres": 3.8,
        "latitude": 30.801,
        "longitude": 75.945,
        "stage": "Harvest Ready",
        "ready_for_dispatch_kg": 12500,
        "dock_status": "Bay Open",
    },
]

SAMPLE_WAREHOUSES = [
    {
        "id": "wh-ludhiana-cold",
        "name": "Ludhiana Central AgroCold & CA Hub",
        "code": "WH-LDH-01",
        "type": "Cold Storage & CA",
        "latitude": 30.9125,
        "longitude": 75.882,
        "total_capacity_mt": 5000,
        "occupied_capacity_mt": 3900,
        "temperature_c": 4.8,
        "humidity_percent": 90,
        "available_bays": 4,
        "manager_name": "Sandeep Varma",
        "distance_km": 14.8,
    },
    {
        "id": "wh-khanna-silo",
        "name": "Khanna Agro Logistics & Silo Complex",
        "code": "WH-KHN-02",
        "type": "Grain Silo Hub",
        "latitude": 30.705,
        "longitude": 76.218,
        "total_capacity_mt": 25000,
        "occupied_capacity_mt": 19800,
        "temperature_c": 17.5,
        "humidity_percent": 52,
        "available_bays": 8,
        "manager_name": "Kuldeep Dhillon",
        "distance_km": 28.4,
    },
    {
        "id": "wh-jalandhar-terminal",
        "name": "Jalandhar Cold Chain & Processing Terminal",
        "code": "WH-JAL-03",
        "type": "Agro-Processing & Terminal",
        "latitude": 31.312,
        "longitude": 75.602,
        "total_capacity_mt": 8000,
        "occupied_capacity_mt": 7100,
        "temperature_c": 2.5,
        "humidity_percent": 88,
        "available_bays": 2,
        "manager_name": "Gurdas Gill",
        "distance_km": 62.0,
    },
]

SAMPLE_TRANSPORTERS = [
    {
        "id": "trk-01",
        "vehicle_number": "PB-10-CZ-4412",
        "vehicle_type": "Reefer Van (Cold Chain)",
        "driver_name": "Gurpreet Singh",
        "driver_phone": "+91 98765-43210",
        "latitude": 30.871,
        "longitude": 75.928,
        "speed_kmh": 46.0,
        "status": "In Transit",
        "cargo": {
            "batch_code": "BATCH-TM-2026-04",
            "crop": "Tomato",
            "variety": "Abhinav Hybrid",
            "quantity_kg": 4200.0,
            "grade": "Grade A",
            "target_temp_c": 6.0,
            "actual_temp_c": 6.3,
        },
        "origin_name": "Ramesh Estate - Plot B",
        "destination_name": "Ludhiana Central AgroCold Hub",
        "eta_minutes": 16,
        "distance_remaining_km": 7.6,
    },
    {
        "id": "trk-02",
        "vehicle_number": "PB-08-BK-8901",
        "vehicle_type": "Heavy Flatbed (16-Wheeler)",
        "driver_name": "Harjit Mand",
        "driver_phone": "+91 98123-77441",
        "latitude": 30.73,
        "longitude": 76.155,
        "speed_kmh": 38.0,
        "status": "Approaching Hub",
        "cargo": {
            "batch_code": "BATCH-RC-2025-11",
            "crop": "Basmati Rice",
            "variety": "Pusa 1121",
            "quantity_kg": 12500.0,
            "grade": "Grade A+",
        },
        "origin_name": "Ramesh Canal Estate - Plot C",
        "destination_name": "Khanna Agro Logistics & Silo Hub",
        "eta_minutes": 11,
        "distance_remaining_km": 6.9,
    },
]


@app.get("/api/logistics/overview")
def get_logistics_overview():
    total_cargo = sum(t["cargo"]["quantity_kg"] for t in SAMPLE_TRANSPORTERS)
    total_cap = sum(w["total_capacity_mt"] for w in SAMPLE_WAREHOUSES)
    occupied_cap = sum(w["occupied_capacity_mt"] for w in SAMPLE_WAREHOUSES)

    return {
        "active_fleet_count": len(SAMPLE_TRANSPORTERS),
        "total_cargo_in_transit_kg": total_cargo,
        "connected_warehouses_count": len(SAMPLE_WAREHOUSES),
        "total_warehouse_capacity_mt": total_cap,
        "available_warehouse_capacity_mt": total_cap - occupied_cap,
        "farmer_fields_count": len(SAMPLE_FIELDS),
        "cold_chain_status": "Optimal",
        "transporters": SAMPLE_TRANSPORTERS,
        "warehouses": SAMPLE_WAREHOUSES,
        "fields": SAMPLE_FIELDS,
    }


@app.get("/api/logistics/transporters")
def list_transporters():
    return SAMPLE_TRANSPORTERS


@app.get("/api/logistics/warehouses")
def list_warehouses():
    return SAMPLE_WAREHOUSES


@app.get("/api/logistics/fields")
def list_farmer_fields():
    return SAMPLE_FIELDS


@app.post("/api/logistics/dispatch")
def create_dispatch(request: DispatchRequest):
    new_truck = {
        "id": f"trk-{int(time.time())}",
        "vehicle_number": request.vehicle_number.upper(),
        "vehicle_type": request.vehicle_type,
        "driver_name": request.driver_name,
        "driver_phone": request.driver_phone,
        "latitude": 30.841,
        "longitude": 75.991,
        "speed_kmh": 45.0,
        "status": "Loading at Farm",
        "cargo": {
            "batch_code": request.crop_batch_code,
            "crop": request.crop,
            "variety": request.variety,
            "quantity_kg": request.quantity_kg,
            "grade": "Grade A",
            "target_temp_c": request.target_temp_c,
            "actual_temp_c": request.target_temp_c,
        },
        "origin_name": "Ramesh Farm Field",
        "destination_name": "AgroCold Logistics Hub",
        "eta_minutes": 25,
        "distance_remaining_km": 18.5,
    }
    SAMPLE_TRANSPORTERS.append(new_truck)
    return {
        "success": True,
        "message": f"Transporter {request.vehicle_number} successfully booked and dispatched",
        "transporter": new_truck,
    }