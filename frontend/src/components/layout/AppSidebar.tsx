import {
  Activity,
  Bot,
  BrainCircuit,
  CloudSun,
  LayoutDashboard,
  Leaf,
  LogOut,
  Package,
  ScanLine,
  Sprout,
  TrendingUp,
  Truck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Weather Forecast",
    path: "/app/weather",
    icon: CloudSun,
    badge: "7-Day",
  },
  {
    label: "My Crops",
    path: "/app/crops",
    icon: Sprout,
  },
  {
    label: "AI Disease Detection",
    path: "/app/disease-detection",
    icon: ScanLine,
    badge: "AI Vision",
  },
  {
    label: "Produce & Storage",
    path: "/app/produce",
    icon: Package,
  },
  {
    label: "Map & Logistics",
    path: "/app/logistics",
    icon: Truck,
    badge: "Live GPS",
  },
  {
    label: "Decision Engine",
    path: "/app/decision-engine",
    icon: BrainCircuit,
    badge: "Smart",
  },
  {
    label: "Market Intelligence",
    path: "/app/market",
    icon: TrendingUp,
  },
  {
    label: "Farm Analytics",
    path: "/app/analytics",
    icon: Activity,
  },
  {
    label: "Kisan AI & Voice Assistant",
    path: "/app/assistant",
    icon: Bot,
    badge: "AI + Voice",
  },
];

function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 text-white md:flex md:flex-col">
      {/* Brand */}
      <div className="border-b border-slate-800/80 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-950">
            <Leaf size={22} className="text-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-white">Sasyam</h1>
              <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[10px] font-semibold text-emerald-400">SIH</span>
            </div>
            <p className="text-xs text-emerald-400">Smart AI Agriculture Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Modules
        </p>

        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 shadow-sm border border-emerald-500/20 font-semibold"
                      : "text-slate-300 hover:bg-slate-900/80 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon size={18} className="shrink-0" />

                <span className="flex-1 truncate">{item.label}</span>

                {item.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      item.badge === "AI Vision"
                        ? "bg-amber-400 text-slate-950"
                        : item.badge === "Live GPS"
                        ? "bg-amber-400 text-slate-950 animate-pulse"
                        : item.badge === "Smart"
                        ? "bg-emerald-400 text-slate-950"
                        : item.badge === "7-Day"
                        ? "bg-sky-400 text-slate-950"
                        : "bg-cyan-400 text-slate-950"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Live status banner */}
        <div className="mt-8 rounded-xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/40 to-slate-900/60 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Mandi Price Sync: Live
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Connected to APMC e-NAM network. 4 Mandis tracked in your zone.
          </p>
        </div>
      </div>

      {/* User Footer */}
      <div className="border-t border-slate-800/80 p-3.5">
        <div className="flex items-center justify-between rounded-xl bg-slate-900/90 p-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
              RK
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">Ramesh Kumar</p>
              <p className="truncate text-[11px] text-emerald-400">Punjab Farm #4</p>
            </div>
          </div>

          <NavLink
            to="/login"
            title="Switch User / Logout"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <LogOut size={16} />
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;