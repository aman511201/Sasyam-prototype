import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  MapPin,
  Search,
  Store,
  TrendingDown,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "@/components/common/PageHeader";
import { Link } from "react-router-dom";

interface MandiData {
  id: string;
  mandi: string;
  state: string;
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  msp: number;
  dailyChange: number;
  arrivals: number; // in quintals
  distanceKm: number;
  trend: "up" | "down" | "stable";
}

const mandiDatabase: MandiData[] = [
  {
    id: "1",
    mandi: "Azadpur Mandi",
    state: "Delhi",
    commodity: "Tomato",
    variety: "Hybrid Red",
    minPrice: 2800,
    maxPrice: 3800,
    modalPrice: 3400,
    msp: 1950,
    dailyChange: 14.2,
    arrivals: 4200,
    distanceKm: 180,
    trend: "up",
  },
  {
    id: "2",
    mandi: "Khanna Mandi",
    state: "Punjab",
    commodity: "Wheat",
    variety: "Sharbati (PBW-550)",
    minPrice: 2380,
    maxPrice: 2650,
    modalPrice: 2520,
    msp: 2275,
    dailyChange: 2.1,
    arrivals: 11500,
    distanceKm: 32,
    trend: "up",
  },
  {
    id: "3",
    mandi: "Lasalgaon Mandi",
    state: "Maharashtra",
    commodity: "Onion",
    variety: "Rabi Red",
    minPrice: 1900,
    maxPrice: 2850,
    modalPrice: 2600,
    msp: 1750,
    dailyChange: -3.4,
    arrivals: 18400,
    distanceKm: 420,
    trend: "down",
  },
  {
    id: "4",
    mandi: "Karnal Mandi",
    state: "Haryana",
    commodity: "Basmati Rice",
    variety: "1121 Pusa",
    minPrice: 4200,
    maxPrice: 4850,
    modalPrice: 4600,
    msp: 2320,
    dailyChange: 5.8,
    arrivals: 6800,
    distanceKm: 95,
    trend: "up",
  },
  {
    id: "5",
    mandi: "Farrukhabad Mandi",
    state: "Uttar Pradesh",
    commodity: "Potato",
    variety: "Kufri Jyoti",
    minPrice: 1200,
    maxPrice: 1650,
    modalPrice: 1450,
    msp: 1150,
    dailyChange: -1.8,
    arrivals: 9200,
    distanceKm: 240,
    trend: "down",
  },
  {
    id: "6",
    mandi: "Ludhiana Mandi",
    state: "Punjab",
    commodity: "Tomato",
    variety: "Desi",
    minPrice: 1900,
    maxPrice: 2300,
    modalPrice: 2100,
    msp: 1950,
    dailyChange: 1.5,
    arrivals: 2100,
    distanceKm: 15,
    trend: "stable",
  },
  {
    id: "7",
    mandi: "Jaipur Mandi (Muhana)",
    state: "Rajasthan",
    commodity: "Mustard",
    variety: "Yellow Seed",
    minPrice: 5200,
    maxPrice: 5850,
    modalPrice: 5650,
    msp: 5650,
    dailyChange: 3.2,
    arrivals: 3400,
    distanceKm: 280,
    trend: "up",
  },
];

const priceHistoryData = [
  { day: "Mon", Tomato: 2600, Wheat: 2420, Potato: 1480, Basmati: 4350 },
  { day: "Tue", Tomato: 2800, Wheat: 2450, Potato: 1460, Basmati: 4400 },
  { day: "Wed", Tomato: 2950, Wheat: 2460, Potato: 1440, Basmati: 4450 },
  { day: "Thu", Tomato: 3100, Wheat: 2480, Potato: 1450, Basmati: 4500 },
  { day: "Fri", Tomato: 3250, Wheat: 2500, Potato: 1430, Basmati: 4550 },
  { day: "Sat", Tomato: 3350, Wheat: 2510, Potato: 1440, Basmati: 4580 },
  { day: "Today", Tomato: 3400, Wheat: 2520, Potato: 1450, Basmati: 4600 },
];

function Market() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chartCrop, setChartCrop] = useState<"Tomato" | "Wheat" | "Potato" | "Basmati">("Tomato");

  const filteredMandis = mandiDatabase.filter((item) => {
    const matchesCommodity = selectedCommodity === "All" || item.commodity === selectedCommodity;
    const matchesSearch =
      item.mandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCommodity && matchesSearch;
  });

  const commodities = ["All", "Tomato", "Wheat", "Potato", "Basmati Rice", "Onion", "Mustard"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="APMC Mandi Market Intelligence & e-NAM Tracker"
        description="Real-time modal prices, MSP compliance, mandi arrivals, and price surge forecasts across northern and national agricultural markets."
        action={
          <Link
            to="/app/decision-engine"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
          >
            <Zap size={14} />
            Optimize Selling Strategy
          </Link>
        }
      />

      {/* Top Commodity Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Tomato", price: "₹3,400", unit: "qtl", change: "+14.2%", up: true, msp: "MSP: ₹1,950" },
          { name: "Wheat (PBW-550)", price: "₹2,520", unit: "qtl", change: "+2.1%", up: true, msp: "MSP: ₹2,275" },
          { name: "Potato (Jyoti)", price: "₹1,450", unit: "qtl", change: "-1.8%", up: false, msp: "MSP: ₹1,150" },
          { name: "Basmati Rice 1121", price: "₹4,600", unit: "qtl", change: "+5.8%", up: true, msp: "MSP: ₹2,320" },
        ].map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{item.name}</span>
              <span
                className={`flex items-center text-[11px] font-bold ${
                  item.up ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {item.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {item.change}
              </span>
            </div>

            <p className="mt-2 text-2xl font-black text-slate-900">
              {item.price} <span className="text-xs font-normal text-slate-500">/{item.unit}</span>
            </p>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
              <span className="text-emerald-700 font-semibold">{item.msp}</span>
              <span className="text-[10px] text-slate-400">Above MSP</span>
            </div>
          </div>
        ))}
      </div>

      {/* 7-Day Interactive Mandi Price Trend Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">
                7-Day Mandi Price Movement & Forecasting
              </h3>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Live e-NAM Feed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical modal price curve (₹ per Quintal)
            </p>
          </div>

          {/* Commodity Pill Switcher */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(["Tomato", "Wheat", "Potato", "Basmati"] as const).map((crop) => (
              <button
                key={crop}
                onClick={() => setChartCrop(crop)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  chartCrop === crop
                    ? "bg-white text-emerald-700 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistoryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                formatter={(val: any) => [`₹${val} / qtl`, "Modal Rate"]}
              />
              <Area type="monotone" dataKey={chartCrop} stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {commodities.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCommodity(item)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition shrink-0 ${
                selectedCommodity === item
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex w-full sm:w-72 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search mandi, state, variety..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Mandi Price Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5 font-bold">Mandi & State</th>
                <th className="px-4 py-3.5 font-bold">Commodity / Variety</th>
                <th className="px-4 py-3.5 font-bold text-right">Modal Rate</th>
                <th className="px-4 py-3.5 font-bold text-right">Min - Max Rate</th>
                <th className="px-4 py-3.5 font-bold text-right">MSP Buffer</th>
                <th className="px-4 py-3.5 font-bold text-right">Daily Change</th>
                <th className="px-4 py-3.5 font-bold text-right">Arrivals (qtl)</th>
                <th className="px-5 py-3.5 font-bold text-center">Distance & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMandis.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0 font-bold text-xs">
                        <Store size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.mandi}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin size={11} /> {item.state}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">{item.commodity}</p>
                    <p className="text-[11px] text-slate-500">{item.variety}</p>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span className="font-black text-slate-900 text-sm">
                      ₹{item.modalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-slate-400 block">per qtl</span>
                  </td>

                  <td className="px-4 py-4 text-right font-medium text-slate-600">
                    ₹{item.minPrice} - ₹{item.maxPrice}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                      +₹{(item.modalPrice - item.msp).toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                        item.trend === "up"
                          ? "text-emerald-600"
                          : item.trend === "down"
                          ? "text-rose-600"
                          : "text-slate-600"
                      }`}
                    >
                      {item.trend === "up" ? (
                        <TrendingUp size={14} />
                      ) : item.trend === "down" ? (
                        <TrendingDown size={14} />
                      ) : (
                        "•"
                      )}
                      {item.dailyChange > 0 ? `+${item.dailyChange}%` : `${item.dailyChange}%`}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-slate-700">
                    {item.arrivals.toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <Link
                      to="/app/decision-engine"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                    >
                      <Truck size={13} />
                      {item.distanceKm} km • Plan
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Market;