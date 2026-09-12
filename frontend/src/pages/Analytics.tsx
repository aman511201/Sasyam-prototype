import {
  ArrowUpRight,
  Download,
  Droplets,
  ShieldCheck,
  TrendingUp,
  Wheat,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "@/components/common/PageHeader";

const financialData = [
  { month: "Sep", Revenue: 85000, Expenses: 32000, Profit: 53000 },
  { month: "Oct", Revenue: 110000, Expenses: 41000, Profit: 69000 },
  { month: "Nov", Revenue: 195000, Expenses: 58000, Profit: 137000 },
  { month: "Dec", Revenue: 145000, Expenses: 44000, Profit: 101000 },
  { month: "Jan", Revenue: 175000, Expenses: 52000, Profit: 123000 },
  { month: "Feb", Revenue: 240000, Expenses: 68000, Profit: 172000 },
];

const cropYieldData = [
  { crop: "Wheat", TargetYield: 7.0, ActualYield: 7.8, PrevSeason: 6.4 },
  { crop: "Tomato", TargetYield: 9.0, ActualYield: 10.2, PrevSeason: 7.9 },
  { crop: "Basmati", TargetYield: 6.5, ActualYield: 7.2, PrevSeason: 5.8 },
  { crop: "Potato", TargetYield: 11.0, ActualYield: 12.5, PrevSeason: 9.6 },
  { crop: "Mustard", TargetYield: 4.5, ActualYield: 5.1, PrevSeason: 4.0 },
];

const soilTrendsData = [
  { month: "Sep", Nitrogen: 110, Phosphorus: 38, Potassium: 72, Moisture: 62 },
  { month: "Oct", Nitrogen: 125, Phosphorus: 42, Potassium: 78, Moisture: 68 },
  { month: "Nov", Nitrogen: 140, Phosphorus: 48, Potassium: 85, Moisture: 74 },
  { month: "Dec", Nitrogen: 135, Phosphorus: 46, Potassium: 82, Moisture: 70 },
  { month: "Jan", Nitrogen: 130, Phosphorus: 44, Potassium: 80, Moisture: 66 },
  { month: "Feb", Nitrogen: 128, Phosphorus: 45, Potassium: 79, Moisture: 68 },
];

function Analytics() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Farm Financial & Yield Analytics"
        description="Consolidated intelligence on seasonal crop yields, operational cost breakdowns, soil nutrient trends, and post-harvest loss prevention metrics."
        action={
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm">
            <Download size={14} />
            Export ICAR Agri Report
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Realized Profit</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            ₹6,55,000
          </p>
          <div className="mt-2 flex items-center text-xs font-bold text-emerald-600">
            <ArrowUpRight size={14} />
            <span>+24.8% net profit increase</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Spoilage Loss Reduction</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">
            4.2% <span className="text-xs font-normal text-slate-500">(Down from 22%)</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Saved ₹1.4 Lakh via Decision Engine</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Input Cost Efficiency</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Droplets size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-blue-700">
            -18.5%
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Optimized precision fertilizer & irrigation</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Yield Improvement</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Wheat size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            +14.2%
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Beat district average by 1.8 MT/ha</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Cash Flow & Profit</h3>
              <p className="text-xs text-slate-500">Revenue from APMC mandis vs input costs</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              ₹ INR
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                  formatter={(val: any) => [`₹${val.toLocaleString("en-IN")}`, ""]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#profitGrad)" />
                <Line type="monotone" dataKey="Revenue" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Yield Comparison Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Crop Yield Comparison (Metric Tons)</h3>
              <p className="text-xs text-slate-500">Actual harvest vs Target vs Previous season</p>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
              Metric Tons
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropYieldData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="crop" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                  formatter={(val: any) => [`${val} MT`, ""]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="ActualYield" name="Actual Harvest" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="TargetYield" name="Target Plan" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="PrevSeason" name="Previous Season" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Soil Health Trendline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Soil Nutrient Index & Hydration Over Time</h3>
            <p className="text-xs text-slate-500">Nitrogen (N), Phosphorus (P), Potassium (K) mg/kg and Soil Moisture %</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            IoT Sensors Linked
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={soilTrendsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="Nitrogen" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Phosphorus" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Potassium" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Moisture" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;