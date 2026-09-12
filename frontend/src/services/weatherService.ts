// Open-Meteo Free Weather API Service for Sasyam

export interface GeoLocation {
  id?: number | string;
  name: string;
  admin1?: string; // State / Province
  country: string;
  latitude: number;
  longitude: number;
}

export interface AgroAdvisory {
  status: "optimal" | "warning" | "caution" | "info";
  title: string;
  description: string;
  tag: string;
}

export interface DailyForecastDay {
  date: string; // ISO date YYYY-MM-DD
  dayName: string; // "Today", "Tomorrow", "Mon", etc.
  formattedDate: string; // e.g. "12 Sep"
  weatherCode: number;
  conditionText: string;
  iconType: "sun" | "cloud-sun" | "cloud" | "cloud-drizzle" | "cloud-rain" | "cloud-lightning" | "snowflake" | "cloud-fog";
  tempMax: number;
  tempMin: number;
  precipitationSum: number; // mm
  precipitationProbability: number; // %
  windSpeedMax: number; // km/h
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  agroAdvisory: AgroAdvisory;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  weatherCode: number;
  conditionText: string;
  iconType: "sun" | "cloud-sun" | "cloud" | "cloud-drizzle" | "cloud-rain" | "cloud-lightning" | "snowflake" | "cloud-fog";
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  isDay: boolean;
}

export interface ProcessedWeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  daily: DailyForecastDay[];
  summary: {
    totalExpectedRain7Days: number;
    avgTempMax: number;
    rainDaysCount: number;
    sprayingSuitabilityOverall: string;
    irrigationRecommendation: string;
    diseaseRiskAssessment: string;
  };
  lastUpdated: string;
  isLive: boolean;
}

// Preset Agricultural Zones in India
export const PRESET_LOCATIONS: GeoLocation[] = [
  {
    id: "ludhiana",
    name: "Ludhiana",
    admin1: "Punjab",
    country: "India",
    latitude: 30.901,
    longitude: 75.857,
  },
  {
    id: "karnal",
    name: "Karnal",
    admin1: "Haryana",
    country: "India",
    latitude: 29.685,
    longitude: 76.990,
  },
  {
    id: "nashik",
    name: "Nashik",
    admin1: "Maharashtra",
    country: "India",
    latitude: 19.997,
    longitude: 73.789,
  },
  {
    id: "indore",
    name: "Indore",
    admin1: "Madhya Pradesh",
    country: "India",
    latitude: 22.719,
    longitude: 75.857,
  },
  {
    id: "varanasi",
    name: "Varanasi",
    admin1: "Uttar Pradesh",
    country: "India",
    latitude: 25.317,
    longitude: 82.973,
  },
  {
    id: "guntur",
    name: "Guntur",
    admin1: "Andhra Pradesh",
    country: "India",
    latitude: 16.306,
    longitude: 80.436,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    admin1: "Rajasthan",
    country: "India",
    latitude: 26.912,
    longitude: 75.787,
  },
];

// WMO Weather Code Mapping to human-readable label and icon
export function getWeatherInterpretation(code: number, isDay: boolean = true) {
  switch (code) {
    case 0:
      return {
        label: isDay ? "Clear Sky" : "Clear Night",
        iconType: "sun" as const,
        color: "text-amber-500",
        badgeColor: "bg-amber-100 text-amber-800",
      };
    case 1:
      return {
        label: "Mainly Clear",
        iconType: "cloud-sun" as const,
        color: "text-amber-500",
        badgeColor: "bg-amber-50 text-amber-700",
      };
    case 2:
      return {
        label: "Partly Cloudy",
        iconType: "cloud-sun" as const,
        color: "text-sky-500",
        badgeColor: "bg-sky-50 text-sky-700",
      };
    case 3:
      return {
        label: "Overcast",
        iconType: "cloud" as const,
        color: "text-slate-500",
        badgeColor: "bg-slate-100 text-slate-700",
      };
    case 45:
    case 48:
      return {
        label: "Foggy",
        iconType: "cloud-fog" as const,
        color: "text-slate-400",
        badgeColor: "bg-slate-100 text-slate-600",
      };
    case 51:
    case 53:
    case 55:
      return {
        label: "Light Drizzle",
        iconType: "cloud-drizzle" as const,
        color: "text-cyan-500",
        badgeColor: "bg-cyan-50 text-cyan-700",
      };
    case 56:
    case 57:
      return {
        label: "Freezing Drizzle",
        iconType: "snowflake" as const,
        color: "text-blue-400",
        badgeColor: "bg-blue-50 text-blue-700",
      };
    case 61:
      return {
        label: "Slight Rain",
        iconType: "cloud-rain" as const,
        color: "text-blue-500",
        badgeColor: "bg-blue-50 text-blue-700",
      };
    case 63:
      return {
        label: "Moderate Rain",
        iconType: "cloud-rain" as const,
        color: "text-blue-600",
        badgeColor: "bg-blue-100 text-blue-800",
      };
    case 65:
      return {
        label: "Heavy Rain",
        iconType: "cloud-rain" as const,
        color: "text-blue-700",
        badgeColor: "bg-blue-200 text-blue-900",
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: "Snowfall",
        iconType: "snowflake" as const,
        color: "text-sky-400",
        badgeColor: "bg-sky-50 text-sky-700",
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain Showers",
        iconType: "cloud-rain" as const,
        color: "text-blue-600",
        badgeColor: "bg-blue-100 text-blue-800",
      };
    case 85:
    case 86:
      return {
        label: "Snow Showers",
        iconType: "snowflake" as const,
        color: "text-sky-500",
        badgeColor: "bg-sky-100 text-sky-800",
      };
    case 95:
      return {
        label: "Thunderstorm",
        iconType: "cloud-lightning" as const,
        color: "text-amber-600",
        badgeColor: "bg-amber-100 text-amber-900",
      };
    case 96:
    case 99:
      return {
        label: "Thunderstorm with Hail",
        iconType: "cloud-lightning" as const,
        color: "text-rose-600",
        badgeColor: "bg-rose-100 text-rose-900",
      };
    default:
      return {
        label: "Clear Sky",
        iconType: "sun" as const,
        color: "text-amber-500",
        badgeColor: "bg-amber-50 text-amber-700",
      };
  }
}

// Generate agriculture-specific daily advisory
export function calculateAgroAdvisory(
  tempMax: number,
  tempMin: number,
  precipitationSum: number,
  precipitationProbability: number,
  windSpeedMax: number,
  weatherCode: number
): AgroAdvisory {
  // Thunderstorm / Severe Hail
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
    return {
      status: "warning",
      tag: "Severe Storm / Hail Alert",
      title: "Halt All Field Work & Protect Produce",
      description: "Severe thunderstorm forecast. Cease pesticide spraying and harvest operations. Secure nursery shades and drainage channels.",
    };
  }

  // Heavy Rain (> 10mm or prob > 65%)
  if (precipitationSum >= 10 || precipitationProbability >= 65 || weatherCode === 65 || weatherCode === 82) {
    return {
      status: "warning",
      tag: "Heavy Rain / Runoff Risk",
      title: "Halt Chemical Spraying & Open Trenches",
      description: "Significant rainfall will wash away chemical sprays and fertilizers. Ensure drainage outfalls are open to prevent root asphyxiation.",
    };
  }

  // Showers / Moderate Rain (2mm - 9.9mm or prob > 35%)
  if (precipitationSum >= 2 || precipitationProbability >= 35 || weatherCode === 61 || weatherCode === 63 || weatherCode === 80 || weatherCode === 81) {
    return {
      status: "caution",
      tag: "Delay Irrigation",
      title: "Hold Irrigation & Delay Nitrogen Broadcast",
      description: "Expected showers will satisfy topsoil evapotranspiration. Postpone canal or tube-well irrigation to conserve water and power.",
    };
  }

  // High Winds (> 20 km/h)
  if (windSpeedMax >= 20) {
    return {
      status: "caution",
      tag: "High Wind / Drift Risk",
      title: "Postpone Foliar Spraying",
      description: "Gusty wind speeds cause rapid pesticide droplet drift onto adjacent fields. Stake tall crops (Tomato, Banana) to prevent lodging.",
    };
  }

  // Extreme Heat (> 38°C)
  if (tempMax >= 38) {
    return {
      status: "warning",
      tag: "Heat Stress Advisory",
      title: "Schedule Evening Micro-Irrigation",
      description: "High daytime temperatures cause thermal stress. Apply light evening irrigation or run misting sprinklers in polyhouses.",
    };
  }

  // Frost risk (< 5°C)
  if (tempMin <= 5) {
    return {
      status: "caution",
      tag: "Chilling / Frost Risk",
      title: "Frost Mitigation Advisory",
      description: "Cold night temperatures approaching frost threshold. Irrigate soil lightly in late afternoon to raise soil heat retention capacity.",
    };
  }

  // Ideal conditions
  return {
    status: "optimal",
    tag: "Optimal Field Window",
    title: "Ideal for Spraying & Harvesting",
    description: "Clear skies and calm winds provide the ideal window for foliar pesticide/fertilizer application, combine harvesting, and sun drying.",
  };
}

interface GeocodingRawResult {
  id?: number | string;
  name: string;
  admin1?: string;
  admin2?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

interface OpenMeteoRawData {
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    precipitation?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    surface_pressure?: number;
    is_day?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
    uv_index_max?: number[];
    sunrise?: string[];
    sunset?: string[];
  };
}

// Geocoding API search via Open-Meteo
export async function searchLocations(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return PRESET_LOCATIONS;
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding fetch failed");
    const data = (await res.json()) as { results?: GeocodingRawResult[] };

    if (data && data.results && Array.isArray(data.results)) {
      return data.results.map((item: GeocodingRawResult) => ({
        id: item.id || `${item.latitude}-${item.longitude}`,
        name: item.name,
        admin1: item.admin1 || item.admin2 || "",
        country: item.country || "India",
        latitude: item.latitude,
        longitude: item.longitude,
      }));
    }
  } catch (err) {
    console.warn("Geocoding lookup failed, filtering presets:", err);
  }

  // Fallback to searching preset locations
  return PRESET_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(trimmed.toLowerCase()) ||
      (loc.admin1 && loc.admin1.toLowerCase().includes(trimmed.toLowerCase()))
  );
}

// Fetch 7-Day Forecast from Open-Meteo API
export async function fetchWeatherForecast(
  location: GeoLocation
): Promise<ProcessedWeatherData> {
  const { latitude, longitude } = location;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo API returned status: ${res.status}`);
    }

    const data = (await res.json()) as OpenMeteoRawData;
    return processOpenMeteoResponse(data, location, true);
  } catch (err) {
    console.warn("Open-Meteo live fetch failed, generating realistic fallback:", err);
    return generateFallbackWeatherData(location);
  }
}

function processOpenMeteoResponse(
  data: OpenMeteoRawData,
  location: GeoLocation,
  isLive: boolean
): ProcessedWeatherData {
  const currentRaw = data.current || {};
  const dailyRaw = data.daily || {};

  const currentWeatherCode = currentRaw.weather_code ?? 0;
  const isDay = currentRaw.is_day !== 0;
  const currentInterp = getWeatherInterpretation(currentWeatherCode, isDay);

  const current: CurrentWeather = {
    time: currentRaw.time || new Date().toISOString(),
    temperature: Math.round((currentRaw.temperature_2m ?? 28) * 10) / 10,
    apparentTemperature: Math.round((currentRaw.apparent_temperature ?? 30) * 10) / 10,
    relativeHumidity: Math.round(currentRaw.relative_humidity_2m ?? 60),
    precipitation: Math.round((currentRaw.precipitation ?? 0) * 10) / 10,
    weatherCode: currentWeatherCode,
    conditionText: currentInterp.label,
    iconType: currentInterp.iconType,
    windSpeed: Math.round((currentRaw.wind_speed_10m ?? 8) * 10) / 10,
    windDirection: Math.round(currentRaw.wind_direction_10m ?? 90),
    surfacePressure: Math.round(currentRaw.surface_pressure ?? 1012),
    isDay,
  };

  const dates: string[] = dailyRaw.time || [];
  const weatherCodes: number[] = dailyRaw.weather_code || [];
  const tempMaxs: number[] = dailyRaw.temperature_2m_max || [];
  const tempMins: number[] = dailyRaw.temperature_2m_min || [];
  const precipSums: number[] = dailyRaw.precipitation_sum || [];
  const precipProbs: number[] = dailyRaw.precipitation_probability_max || [];
  const windMaxs: number[] = dailyRaw.wind_speed_10m_max || [];
  const uvMaxs: number[] = dailyRaw.uv_index_max || [];
  const sunrises: string[] = dailyRaw.sunrise || [];
  const sunsets: string[] = dailyRaw.sunset || [];

  const daily: DailyForecastDay[] = dates.slice(0, 7).map((dateStr, idx) => {
    const code = weatherCodes[idx] ?? 0;
    const interp = getWeatherInterpretation(code, true);
    const tempMax = Math.round((tempMaxs[idx] ?? 30) * 10) / 10;
    const tempMin = Math.round((tempMins[idx] ?? 20) * 10) / 10;
    const precipSum = Math.round((precipSums[idx] ?? 0) * 10) / 10;
    const precipProb = Math.round(precipProbs[idx] ?? (precipSum > 0 ? 50 : 10));
    const windMax = Math.round((windMaxs[idx] ?? 10) * 10) / 10;
    const uvMax = Math.round((uvMaxs[idx] ?? 6) * 10) / 10;

    const dateObj = new Date(dateStr);
    const dayName =
      idx === 0
        ? "Today"
        : idx === 1
        ? "Tomorrow"
        : dateObj.toLocaleDateString("en-US", { weekday: "short" });

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const agroAdvisory = calculateAgroAdvisory(
      tempMax,
      tempMin,
      precipSum,
      precipProb,
      windMax,
      code
    );

    const formatSunTime = (isoTime?: string) => {
      if (!isoTime) return "--:--";
      const parts = isoTime.split("T");
      return parts[1] ? parts[1].substring(0, 5) : isoTime;
    };

    return {
      date: dateStr,
      dayName,
      formattedDate,
      weatherCode: code,
      conditionText: interp.label,
      iconType: interp.iconType,
      tempMax,
      tempMin,
      precipitationSum: precipSum,
      precipitationProbability: precipProb,
      windSpeedMax: windMax,
      uvIndexMax: uvMax,
      sunrise: formatSunTime(sunrises[idx]),
      sunset: formatSunTime(sunsets[idx]),
      agroAdvisory,
    };
  });

  const totalExpectedRain = Math.round(
    daily.reduce((acc, d) => acc + d.precipitationSum, 0) * 10
  ) / 10;
  const avgMax = Math.round(
    daily.reduce((acc, d) => acc + d.tempMax, 0) / (daily.length || 1)
  );
  const rainDays = daily.filter((d) => d.precipitationSum >= 1 || d.precipitationProbability >= 40).length;

  let sprayingSuitability = "Favorable across 5+ days this week";
  if (rainDays >= 4) {
    sprayingSuitability = "Unfavorable - Multiple rain events forecast";
  } else if (current.windSpeed > 18) {
    sprayingSuitability = "Poor today due to high wind drift; Wait for calmer days";
  }

  let irrigationAdvice = "Maintain standard irrigation schedule";
  if (totalExpectedRain > 15) {
    irrigationAdvice = `Hold off irrigation: ${totalExpectedRain} mm rain projected over next 7 days`;
  } else if (avgMax > 34 && totalExpectedRain < 2) {
    irrigationAdvice = "High evapotranspiration rate: Plan supplemental canal or drip irrigation";
  }

  let diseaseRisk = "Low fungal spore activity";
  if (current.relativeHumidity > 75 && current.temperature > 22) {
    diseaseRisk = "High humidity & warm weather: Elevated risk of Early Blight & Powdery Mildew";
  }

  return {
    location,
    current,
    daily,
    summary: {
      totalExpectedRain7Days: totalExpectedRain,
      avgTempMax: avgMax,
      rainDaysCount: rainDays,
      sprayingSuitabilityOverall: sprayingSuitability,
      irrigationRecommendation: irrigationAdvice,
      diseaseRiskAssessment: diseaseRisk,
    },
    lastUpdated: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isLive,
  };
}

// Offline/Fallback generator for high reliability
function generateFallbackWeatherData(location: GeoLocation): ProcessedWeatherData {
  const today = new Date();
  const daily: DailyForecastDay[] = [];

  const baseMax = 32;
  const baseMin = 22;

  const mockConfigs = [
    { code: 1, rain: 0.0, prob: 10, wind: 8.5 },
    { code: 2, rain: 0.2, prob: 25, wind: 10.2 },
    { code: 61, rain: 4.5, prob: 65, wind: 14.0 },
    { code: 80, rain: 2.1, prob: 45, wind: 11.5 },
    { code: 0, rain: 0.0, prob: 5, wind: 7.2 },
    { code: 1, rain: 0.0, prob: 10, wind: 9.0 },
    { code: 2, rain: 0.0, prob: 15, wind: 8.0 },
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const cfg = mockConfigs[i];
    const interp = getWeatherInterpretation(cfg.code, true);

    const tempMax = baseMax + (i % 3) - 1;
    const tempMin = baseMin + (i % 2);

    daily.push({
      date: dateStr,
      dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" }),
      formattedDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weatherCode: cfg.code,
      conditionText: interp.label,
      iconType: interp.iconType,
      tempMax,
      tempMin,
      precipitationSum: cfg.rain,
      precipitationProbability: cfg.prob,
      windSpeedMax: cfg.wind,
      uvIndexMax: 6.8,
      sunrise: "06:10",
      sunset: "18:32",
      agroAdvisory: calculateAgroAdvisory(tempMax, tempMin, cfg.rain, cfg.prob, cfg.wind, cfg.code),
    });
  }

  const currentInterp = getWeatherInterpretation(1, true);

  return {
    location,
    current: {
      time: today.toISOString(),
      temperature: 30.5,
      apparentTemperature: 33.2,
      relativeHumidity: 64,
      precipitation: 0,
      weatherCode: 1,
      conditionText: currentInterp.label,
      iconType: currentInterp.iconType,
      windSpeed: 8.5,
      windDirection: 75,
      surfacePressure: 1008,
      isDay: true,
    },
    daily,
    summary: {
      totalExpectedRain7Days: 6.8,
      avgTempMax: 32,
      rainDaysCount: 2,
      sprayingSuitabilityOverall: "Favorable window on Days 1, 2, 5, 6",
      irrigationRecommendation: "Light showers expected midweek; delay heavy canal irrigation",
      diseaseRiskAssessment: "Moderate humidity; inspect tomato fields for early leaf spots",
    },
    lastUpdated: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    isLive: false,
  };
}
