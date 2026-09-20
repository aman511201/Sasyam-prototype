import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  CloudRain,
  CloudSun,
  IndianRupee,
  Leaf,
  Mic,
  ScanLine,
  Sparkles,
  Sprout,
  Store,
  Sun,
  TrendingUp,
  Wheat,
  Zap,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Link } from "react-router-dom";
import {
  fetchWeatherForecast,
  PRESET_LOCATIONS,
  type ProcessedWeatherData,
} from "@/services/weatherService";

const stats = [
  {
    label: "Total Farm Area",
    value: "11.5 Acres",
    icon: Leaf,
    sub: "4 Active Plots",
  },
  {
    label: "Active Crops",
    value: "4 Varieties",
    icon: Sprout,
    sub: "Wheat, Tomato, Rice, Potato",
  },
  {
    label: "Expected Harvest",
    value: "31,900 kg",
    icon: Wheat,
    sub: "+8.4% vs last season",
  },
  {
    label: "Total Production Cost",
    value: "₹79,000",
    icon: IndianRupee,
    sub: "Seeds, NPK, Irrigation",
  },
  {
    label: "Estimated Net Profit",
    value: "₹6,55,000",
    icon: ArrowUpRight,
    sub: "+24.8% via Smart Engine",
  },
];

const mandiTicker = [
  { name: "Tomato", mandi: "Azadpur", price: "₹3,400/qtl", change: "+14.2%", up: true },
  { name: "Wheat", mandi: "Khanna", price: "₹2,520/qtl", change: "+2.1%", up: true },
  { name: "Basmati Rice", mandi: "Karnal", price: "₹4,600/qtl", change: "+5.8%", up: true },
  { name: "Mustard", mandi: "Jaipur", price: "₹5,650/qtl", change: "+3.2%", up: true },
  { name: "Potato", mandi: "Farrukhabad", price: "₹1,450/qtl", change: "-1.8%", up: false },
];

function Dashboard() {
  const [weather, setWeather] = useState<ProcessedWeatherData | null>(null);

  useEffect(() => {
    fetchWeatherForecast(PRESET_LOCATIONS[0])
      .then((data) => setWeather(data))
      .catch((err) => console.error("Dashboard weather fetch error:", err));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <PageHeader
        title="Welcome back, Ramesh Kumar! 🌾"
        description="Sasyam Live Command Center: Monitor crop growth stages, APMC Mandi trends, storage shelf-life, and AI decision strategies."
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/app/assistant?mode=voice"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-xs"
            >
              <Mic size={14} className="text-emerald-700" />
              Kisan Voice Assistant
            </Link>
            <Link
              to="/app/assistant"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <Bot size={15} className="text-emerald-600" />
              Ask Kisan AI
            </Link>
            <Link
              to="/app/decision-engine"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              <Zap size={14} />
              Run Decision Engine
            </Link>
          </div>
        }
      />

      {/* Live Mandi Ticker Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px] shrink-0">
            <TrendingUp size={12} /> APMC Live Rates:
          </span>
          {mandiTicker.map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 text-slate-700 shrink-0">
              <span className="font-semibold text-slate-900">{item.name} ({item.mandi}):</span>
              <span className="font-bold">{item.price}</span>
              <span className={`text-[11px] font-bold ${item.up ? "text-emerald-600" : "text-rose-600"}`}>
                {item.change}
              </span>
              {idx < mandiTicker.length - 1 && <span className="text-slate-300">|</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500">
                    {stat.label}
                  </p>

                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <Icon size={18} />
                  </div>
                </div>

                <p className="mt-3 text-2xl font-black text-slate-900">
                  {stat.value}
                </p>
              </div>

              <p className="mt-2 text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-2">
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/app/disease-detection"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition">
            <ScanLine size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">Scan Crop Disease</p>
            <p className="text-[11px] text-slate-500">AI Leaf Diagnostics</p>
          </div>
        </Link>

        <Link
          to="/app/decision-engine"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition">
            <BrainCircuit size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">Decision Engine</p>
            <p className="text-[11px] text-slate-500">Sell vs Cold Storage</p>
          </div>
        </Link>

        <Link
          to="/app/market"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition">
            <Store size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">Mandi Intelligence</p>
            <p className="text-[11px] text-slate-500">Real-time APMC e-NAM</p>
          </div>
        </Link>

        <Link
          to="/app/assistant?mode=voice"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition">
            <Mic size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-slate-900 text-xs sm:text-sm">Kisan Voice & AI</p>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">Live Voice</span>
            </div>
            <p className="text-[11px] text-slate-500">24/7 Voice & Chat ICAR</p>
          </div>
        </Link>
      </div>

      {/* Main dashboard row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Crop Health Overview & Weather Advisory */}
        <div className="space-y-6 lg:col-span-2">
          {/* Current Crop Health */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  Current Field Crop Status & Health
                </h2>
                <p className="text-xs text-slate-500">
                  Live vegetative tracking across registered plots
                </p>
              </div>

              <Link
                to="/app/crops"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Manage All Plots →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  crop: "Wheat (PBW-550)",
                  farm: "Green Acre Farm (Plot #1)",
                  stage: "Tillering Stage (Day 45)",
                  status: "Healthy",
                  moisture: "68%",
                },
                {
                  crop: "Tomato (Abhinav)",
                  farm: "Sunrise Polyhouse (Plot #2)",
                  stage: "Fruiting Stage (Day 62)",
                  status: "Early Blight Alert",
                  moisture: "54%",
                },
                {
                  crop: "Basmati Rice (1121)",
                  farm: "Riverbed Field (Plot #3)",
                  stage: "Panicle Initiation (Day 75)",
                  status: "Healthy",
                  moisture: "82%",
                },
                {
                  crop: "Potato (Kufri Jyoti)",
                  farm: "North Sandy Loam (Plot #4)",
                  stage: "Tuber Bulking (Day 78)",
                  status: "Harvest Ready",
                  moisture: "60%",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 hover:bg-slate-100/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <Sprout size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.crop}</p>
                      <p className="text-xs text-slate-500">
                        {item.farm} • <span className="text-emerald-700 font-medium">{item.stage}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs text-slate-500 font-medium">
                      Moisture: <strong className="text-slate-700">{item.moisture}</strong>
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.status === "Healthy"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Harvest Ready"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Weather & Agrometeorology Advisory */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Micro-Climate Telemetry & Weather Advisory
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live Open-Meteo API • Ludhiana (Punjab Agro Zone)
                  </p>
                </div>
              </div>

              <Link
                to="/app/weather"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View Full 7-Day Forecast →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {weather ? (
                weather.daily.slice(0, 3).map((d, i) => (
                  <div
                    key={d.date}
                    className={`rounded-xl p-3 border text-xs ${
                      i === 0
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className={i === 0 ? "text-emerald-900 font-extrabold" : "text-slate-900"}>
                        {d.dayName} ({d.formattedDate})
                      </span>
                      {d.iconType === "cloud-rain" ? (
                        <CloudRain size={16} className="text-blue-500" />
                      ) : (
                        <Sun size={16} className="text-amber-500" />
                      )}
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">
                      {d.tempMax}°C / <span className="text-slate-500 text-sm font-semibold">{d.tempMin}°C</span>
                    </p>
                    <p className="text-slate-600 mt-0.5 font-medium">
                      {d.conditionText} • Wind: {d.windSpeedMax} km/h
                    </p>
                    <p
                      className={`mt-1 font-semibold text-[11px] ${
                        d.agroAdvisory.status === "warning"
                          ? "text-rose-700"
                          : d.agroAdvisory.status === "caution"
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {d.agroAdvisory.tag}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100 text-xs animate-pulse">
                    <div className="h-4 w-20 bg-blue-200 rounded"></div>
                    <div className="h-6 w-24 bg-blue-200 rounded mt-2"></div>
                    <div className="h-3 w-32 bg-blue-100 rounded mt-2"></div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs animate-pulse">
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    <div className="h-6 w-24 bg-slate-200 rounded mt-2"></div>
                    <div className="h-3 w-32 bg-slate-100 rounded mt-2"></div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs animate-pulse">
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    <div className="h-6 w-24 bg-slate-200 rounded mt-2"></div>
                    <div className="h-3 w-32 bg-slate-100 rounded mt-2"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Smart Recommendation & Spoilage Prevention Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-950 to-emerald-950 p-6 text-white shadow-md">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <Sparkles size={13} />
              AI Decision Alert
            </div>

            <h2 className="mt-3 text-xl font-bold text-white">
              Tomato Spoilage & Mandi Opportunity
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Sunrise Polyhouse tomato batch has <strong>Early Blight</strong> risk and local prices are at ₹2,100/qtl. Transporting to Azadpur Mandi or holding in Cold Storage generates up to <strong>+₹1,04,000 additional net profit</strong>.
            </p>

            <div className="mt-4 rounded-xl bg-white/10 p-3 text-xs space-y-1.5 border border-white/10 backdrop-blur">
              <div className="flex justify-between">
                <span className="text-slate-300">Local Mandi Net:</span>
                <span className="font-semibold">₹1,65,900</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Cold Storage (20 Days):</span>
                <span>₹2,42,800 (+46%)</span>
              </div>
            </div>

            <Link
              to="/app/decision-engine"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-950"
            >
              <Zap size={16} />
              Open Multi-Channel Optimizer
            </Link>
          </div>

          {/* Quick Storage Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Produce In Cold Chain
              </h3>
              <Link to="/app/produce" className="text-xs font-bold text-emerald-600">
                View All →
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">Potato (12.5 MT)</p>
                  <p className="text-[10px] text-slate-400">Chamber #2 • 42 days left</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  Optimal
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">Green Chillies (950 kg)</p>
                  <p className="text-[10px] text-slate-400">Ambient Shed • 3 days left</p>
                </div>
                <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded text-[10px]">
                  Expiring
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;