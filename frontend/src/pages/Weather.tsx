import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Calendar,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Compass,
  Droplets,
  Gauge,
  MapPin,
  Navigation,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import PageHeader from "@/components/common/PageHeader";
import { Link } from "react-router-dom";
import {
  PRESET_LOCATIONS,
  fetchWeatherForecast,
  searchLocations,
  type GeoLocation,
  type ProcessedWeatherData,
  type DailyForecastDay,
} from "@/services/weatherService";

function WeatherIcon({
  type,
  className = "w-6 h-6",
}: {
  type: DailyForecastDay["iconType"];
  className?: string;
}) {
  switch (type) {
    case "sun":
      return <Sun className={`${className} text-amber-500`} />;
    case "cloud-sun":
      return <CloudSun className={`${className} text-amber-500`} />;
    case "cloud":
      return <Cloud className={`${className} text-slate-400`} />;
    case "cloud-drizzle":
      return <CloudDrizzle className={`${className} text-cyan-500`} />;
    case "cloud-rain":
      return <CloudRain className={`${className} text-blue-500`} />;
    case "cloud-lightning":
      return <CloudLightning className={`${className} text-amber-600`} />;
    case "snowflake":
      return <Snowflake className={`${className} text-sky-400`} />;
    case "cloud-fog":
      return <CloudFog className={`${className} text-slate-400`} />;
    default:
      return <Sun className={`${className} text-amber-500`} />;
  }
}

export default function Weather() {
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation>(
    PRESET_LOCATIONS[0]
  );
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"temp" | "rain">("temp");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Load weather data for selected location
  const handleRefresh = () => {
    setLoading(true);
    fetchWeatherForecast(selectedLocation)
      .then((data) => {
        setWeatherData(data);
        setSelectedDayIndex(0);
      })
      .catch((err) => {
        console.error("Failed to refresh weather:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    fetchWeatherForecast(selectedLocation)
      .then((data) => {
        if (isMounted) {
          setWeatherData(data);
          setSelectedDayIndex(0);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load weather:", err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLocation]);

  // Handle location search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchLocations(query);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // GPS Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    setGeoLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const myLocation: GeoLocation = {
          name: "My GPS Location",
          admin1: "Current Farm",
          country: "India",
          latitude: Math.round(pos.coords.latitude * 1000) / 1000,
          longitude: Math.round(pos.coords.longitude * 1000) / 1000,
        };
        setSelectedLocation(myLocation);
        setSearchQuery("");
        setSearchResults([]);
      },
      (err) => {
        setGeoLocating(false);
        setGeoError(
          err.code === 1
            ? "Location permission was denied. Please select a zone below."
            : "Could not retrieve GPS coordinates. Please select a zone."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const selectedDay: DailyForecastDay | null =
    weatherData && weatherData.daily[selectedDayIndex]
      ? weatherData.daily[selectedDayIndex]
      : null;

  // Chart data formatting
  const chartData =
    weatherData?.daily.map((d) => ({
      name: d.dayName,
      date: d.formattedDate,
      maxTemp: d.tempMax,
      minTemp: d.tempMin,
      rainProb: d.precipitationProbability,
      rainfall: d.precipitationSum,
      windSpeed: d.windSpeedMax,
    })) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Page Header */}
      <PageHeader
        title="Agro Weather & 7-Day Forecast ⛅"
        description="Micro-climate telemetry and 7-day weather forecast powered by Open-Meteo free API. Tailored crop spraying windows, rain forecasts, and irrigation advisories."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleUseCurrentLocation}
              disabled={geoLocating}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
            >
              <Navigation
                size={14}
                className={`text-emerald-600 ${geoLocating ? "animate-spin" : ""}`}
              />
              {geoLocating ? "Detecting GPS..." : "Use My Location"}
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Live Data
            </button>
          </div>
        }
      />

      {/* Geolocation error notice */}
      {geoError && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>{geoError}</span>
          </div>
          <button
            onClick={() => setGeoError(null)}
            className="text-amber-600 hover:text-amber-800 font-bold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Location Selector & Agricultural Zones Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MapPin size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedLocation.name}
                  {selectedLocation.admin1 ? `, ${selectedLocation.admin1}` : ""}
                </h3>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                  {selectedLocation.latitude.toFixed(2)}°N,{" "}
                  {selectedLocation.longitude.toFixed(2)}°E
                </span>
                {weatherData?.isLive ? (
                  <span className="flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Open-Meteo Live API
                  </span>
                ) : (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Verified Agrometeorology Model
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Last updated at {weatherData?.lastUpdated || "Just now"}
              </p>
            </div>
          </div>

          {/* Search box with auto-suggest */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search farm city or district..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
            />
            {isSearching && (
              <RefreshCw
                size={14}
                className="absolute right-3 top-2.5 animate-spin text-slate-400"
              />
            )}

            {/* Dropdown Suggestions */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl max-h-60 overflow-y-auto">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Locations Found ({searchResults.length})
                </p>
                {searchResults.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-emerald-50 hover:text-emerald-900 transition"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">
                        {loc.name}
                      </span>
                      {loc.admin1 && (
                        <span className="text-slate-500 ml-1">
                          ({loc.admin1}, {loc.country})
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0 mr-1">
            Major Agricultural Hubs:
          </span>
          {PRESET_LOCATIONS.map((loc) => {
            const isSelected =
              selectedLocation.name === loc.name &&
              selectedLocation.admin1 === loc.admin1;
            return (
              <button
                key={loc.name}
                onClick={() => {
                  setSelectedLocation(loc);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {loc.name} ({loc.admin1})
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Weather Hero & Micro-Climate Telemetry */}
      {weatherData && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main Current Weather Card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-lg lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                  <Sparkles size={13} /> Live Weather Telemetry
                </span>
                <span className="text-xs text-slate-400">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-5xl font-black tracking-tight text-white">
                    {weatherData.current.temperature}°C
                  </div>
                  <p className="mt-1 text-sm font-semibold text-emerald-300">
                    {weatherData.current.conditionText}
                  </p>
                  <p className="text-xs text-slate-400">
                    Feels like {weatherData.current.apparentTemperature}°C •{" "}
                    {weatherData.current.isDay ? "Daytime" : "Nighttime"}
                  </p>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/10 shadow-inner">
                  <WeatherIcon
                    type={weatherData.current.iconType}
                    className="w-12 h-12"
                  />
                </div>
              </div>
            </div>

            {/* Today's High / Low bar */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>
                  Today's Min:{" "}
                  <strong className="text-sky-300 font-bold">
                    {weatherData.daily[0]?.tempMin}°C
                  </strong>
                </span>
                <span>
                  Today's Max:{" "}
                  <strong className="text-amber-300 font-bold">
                    {weatherData.daily[0]?.tempMax}°C
                  </strong>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 w-3/4"></div>
              </div>

              {/* Sun times */}
              <div className="mt-4 flex items-center justify-around rounded-xl bg-white/5 p-2 text-xs border border-white/5">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Sunrise size={14} />
                  <span>Sunrise: {weatherData.daily[0]?.sunrise}</span>
                </div>
                <div className="h-3 w-px bg-white/10"></div>
                <div className="flex items-center gap-1.5 text-rose-300">
                  <Sunset size={14} />
                  <span>Sunset: {weatherData.daily[0]?.sunset}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Micro-climate 4-Metric Grid */}
          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            {/* Relative Humidity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Relative Humidity
                </span>
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Droplets size={18} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">
                  {weatherData.current.relativeHumidity}%
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {weatherData.current.relativeHumidity > 75
                    ? "⚠️ High humidity: Increased fungal & blight danger"
                    : weatherData.current.relativeHumidity < 40
                    ? "Dry ambient air: Rapid evapotranspiration"
                    : "✓ Moderate humidity: Safe vegetative range"}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Soil Evap Rate:</span>
                <span className="font-semibold text-slate-700">
                  {weatherData.current.relativeHumidity > 70 ? "Low" : "Moderate"}
                </span>
              </div>
            </div>

            {/* Wind Speed & Direction */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Wind Speed & Drift
                </span>
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Wind size={18} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">
                  {weatherData.current.windSpeed} km/h
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {weatherData.current.windSpeed > 18
                    ? "⚠️ Gusty winds: Delay foliar chemical spraying"
                    : "✓ Gentle breeze: Safe for foliar & drone spray"}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Compass size={12} /> Direction:
                </span>
                <span className="font-semibold text-slate-700">
                  {weatherData.current.windDirection}° Azimuth
                </span>
              </div>
            </div>

            {/* Precipitation & Rainfall Today */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Rainfall Today
                </span>
                <div className="rounded-lg bg-cyan-50 p-2 text-cyan-600">
                  <CloudRain size={18} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">
                  {weatherData.current.precipitation} mm
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Today's Rain Chance:{" "}
                  <strong className="text-cyan-700">
                    {weatherData.daily[0]?.precipitationProbability}%
                  </strong>
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>7-Day Expected Rain:</span>
                <span className="font-bold text-cyan-700">
                  {weatherData.summary.totalExpectedRain7Days} mm
                </span>
              </div>
            </div>

            {/* Surface Pressure & UV Index */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pressure & UV Radiation
                </span>
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <Gauge size={18} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">
                  {weatherData.current.surfacePressure} hPa
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  UV Index Peak:{" "}
                  <strong className="text-amber-700">
                    {weatherData.daily[0]?.uvIndexMax} (Moderate)
                  </strong>
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Field Work Risk:</span>
                <span className="font-semibold text-emerald-700">Low Hazard</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Agricultural Forecast Grid (Key Requirement) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Next 7-Day Agricultural Weather Forecast 📅
            </h2>
            <p className="text-xs text-slate-500">
              Click on any day below to inspect targeted agronomic spraying,
              irrigation, and disease advisories.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Calendar size={14} className="text-emerald-600" />
            <span>7 Full Daily Forecast Days</span>
          </div>
        </div>

        {weatherData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weatherData.daily.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;

              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col justify-between rounded-2xl p-4 text-left transition duration-150 border relative ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {/* Top: Day title & date */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? "text-emerald-800" : "text-slate-900"
                        }`}
                      >
                        {day.dayName}
                      </span>
                      {idx === 0 && (
                        <span className="rounded bg-emerald-600 px-1 py-0.2 text-[9px] font-bold text-white uppercase">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{day.formattedDate}</p>

                    {/* Icon & condition */}
                    <div className="my-3 flex flex-col items-center justify-center">
                      <WeatherIcon type={day.iconType} className="w-9 h-9" />
                      <span className="mt-1 text-center text-[11px] font-semibold text-slate-700 leading-tight">
                        {day.conditionText}
                      </span>
                    </div>
                  </div>

                  {/* Temperature Range */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900">{day.tempMax}°</span>
                      <span className="text-slate-400 font-normal">
                        {day.tempMin}°
                      </span>
                    </div>

                    {/* Temperature Bar */}
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(30, ((day.tempMax - 15) / 30) * 100)
                          )}%`,
                        }}
                      ></div>
                    </div>

                    {/* Rain Probability & Amount */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          day.precipitationProbability >= 50
                            ? "text-blue-600"
                            : day.precipitationProbability >= 20
                            ? "text-sky-600"
                            : "text-slate-400"
                        }`}
                      >
                        <CloudRain size={12} />
                        {day.precipitationProbability}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {day.precipitationSum > 0
                          ? `${day.precipitationSum}mm`
                          : "0mm"}
                      </span>
                    </div>

                    {/* Agro Advisory Tag */}
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <span
                        className={`block truncate rounded-md px-1.5 py-0.5 text-[9px] font-bold text-center ${
                          day.agroAdvisory.status === "warning"
                            ? "bg-rose-100 text-rose-800"
                            : day.agroAdvisory.status === "caution"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {day.agroAdvisory.tag}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Day Actionable Agro-Advisory Banner */}
      {selectedDay && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-slate-50 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    selectedDay.agroAdvisory.status === "warning"
                      ? "bg-rose-600 text-white"
                      : selectedDay.agroAdvisory.status === "caution"
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-700 text-white"
                  }`}
                >
                  {selectedDay.dayName} Advisory
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedDay.agroAdvisory.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                {selectedDay.agroAdvisory.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="rounded-xl bg-white px-3 py-2 border border-slate-200 text-xs shadow-xs">
                <span className="text-slate-400 block text-[10px]">Peak Temp</span>
                <span className="font-bold text-slate-900">
                  {selectedDay.tempMax}°C (Low: {selectedDay.tempMin}°C)
                </span>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 border border-slate-200 text-xs shadow-xs">
                <span className="text-slate-400 block text-[10px]">Max Gusts</span>
                <span className="font-bold text-slate-900">
                  {selectedDay.windSpeedMax} km/h
                </span>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 border border-slate-200 text-xs shadow-xs">
                <span className="text-slate-400 block text-[10px]">Rain Sum</span>
                <span className="font-bold text-blue-700">
                  {selectedDay.precipitationSum} mm ({selectedDay.precipitationProbability}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Temperature & Rain Interactive Trend Charts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              7-Day Agrometeorology Trends & Telemetry Visualizer
            </h3>
            <p className="text-xs text-slate-500">
              Forecast telemetry curve across the next seven days
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("temp")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "temp"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Temperature Curve (°C)
            </button>
            <button
              onClick={() => setActiveTab("rain")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "rain"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Rainfall & Wind (mm / km/h)
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {activeTab === "temp" ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  unit="°C"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="maxTemp"
                  name="Max Temp (°C)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMax)"
                />
                <Area
                  type="monotone"
                  dataKey="minTemp"
                  name="Min Temp (°C)"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMin)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="rainfall"
                  name="Precipitation Sum (mm)"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="windSpeed"
                  name="Max Wind Speed (km/h)"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Kisan 4-Pillar Agrometeorology Advisory Matrix */}
      {weatherData && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Pillar 1: Spraying Window */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck size={20} />
              <h4 className="font-bold text-sm text-slate-900">
                Pesticide & Spraying
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {weatherData.summary.sprayingSuitabilityOverall}
            </p>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-[11px] font-medium text-emerald-800 border border-emerald-100">
              Optimal spray window: Early morning (6:30 AM - 9:30 AM) when wind &lt; 10 km/h.
            </div>
          </div>

          {/* Pillar 2: Irrigation Scheduling */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-700">
              <Droplets size={20} />
              <h4 className="font-bold text-sm text-slate-900">
                Irrigation Schedule
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {weatherData.summary.irrigationRecommendation}
            </p>
            <div className="rounded-xl bg-blue-50 p-2.5 text-[11px] font-medium text-blue-800 border border-blue-100">
              Total 7-day precipitation:{" "}
              <strong>{weatherData.summary.totalExpectedRain7Days} mm</strong>
            </div>
          </div>

          {/* Pillar 3: Disease Risk Forecast */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle size={20} />
              <h4 className="font-bold text-sm text-slate-900">
                Crop Disease Risk
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {weatherData.summary.diseaseRiskAssessment}
            </p>
            <Link
              to="/app/disease-detection"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 pt-1"
            >
              Scan leaves with AI Vision →
            </Link>
          </div>

          {/* Pillar 4: Smart Decision Engine Link */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900 to-slate-950 p-5 text-white shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Sparkles size={14} /> AI Decision Integration
              </div>
              <h4 className="mt-2 font-bold text-white text-sm">
                Weather-Aware Mandi Dispatch
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Correlate upcoming 7-day rainfall with APMC price fluctuations and storage shelf-life.
              </p>
            </div>
            <Link
              to="/app/decision-engine"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              <Zap size={14} />
              Optimize Sell vs Storage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
