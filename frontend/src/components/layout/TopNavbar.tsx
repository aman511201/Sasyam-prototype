import { useState } from "react";
import { Bell, CheckCircle2, ChevronDown, CloudSun, Globe, Search, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";

function TopNavbar() {
  const [lang, setLang] = useState<"EN" | "HI" | "PA">("EN");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: "Mandi Price Alert: Tomatoes (+14%)",
      desc: "Azadpur Mandi prices reached ₹3,800/qtl. Best time to sell current stock.",
      time: "10m ago",
      type: "price",
    },
    {
      id: 2,
      title: "Disease Alert in your district",
      desc: "Early Blight reports in neighboring plots. Check Tomato batch with AI Vision.",
      time: "1h ago",
      type: "alert",
    },
    {
      id: 3,
      title: "Weather Advisory: Rain expected",
      desc: "Light to moderate showers in 36 hours. Delay pesticide spray on Wheat.",
      time: "3h ago",
      type: "weather",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:px-6">
      {/* Search */}
      <div className="flex w-full max-w-md items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/90 px-3.5 py-2 text-slate-600 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
        <Search size={17} className="text-slate-400 shrink-0" />

        <input
          type="text"
          placeholder="Search crops, mandis, diseases or ask AI..."
          className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-slate-400"
        />

        <kbd className="hidden sm:inline-flex rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
          /
        </kbd>
      </div>

      {/* Right side items */}
      <div className="ml-4 flex items-center gap-2 sm:gap-3">
        {/* Quick Action: Weather */}
        <Link
          to="/app/weather"
          title="Live Weather & 7-Day Forecast"
          className="hidden md:flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 border border-sky-200/70 transition"
        >
          <CloudSun size={14} className="text-sky-600" />
          Weather 7-Day
        </Link>

        {/* Quick Action: Decision Engine */}
        <Link
          to="/app/decision-engine"
          className="hidden lg:flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70 transition"
        >
          <Sparkles size={14} className="text-emerald-600" />
          Smart Decision Engine
        </Link>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Globe size={14} className="text-slate-500" />
            <span>
              {lang === "EN" ? "English" : lang === "HI" ? "हिंदी" : "ਪੰਜਾਬੀ"}
            </span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-32 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/50 z-50">
              <button
                onClick={() => {
                  setLang("EN");
                  setShowLangMenu(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                  lang === "EN" ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                English {lang === "EN" && <CheckCircle2 size={13} />}
              </button>
              <button
                onClick={() => {
                  setLang("HI");
                  setShowLangMenu(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                  lang === "HI" ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                हिंदी {lang === "HI" && <CheckCircle2 size={13} />}
              </button>
              <button
                onClick={() => {
                  setLang("PA");
                  setShowLangMenu(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                  lang === "PA" ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                ਪੰਜਾਬੀ {lang === "PA" && <CheckCircle2 size={13} />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setUnreadCount(0);
            }}
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm">Notifications & Alerts</h3>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Live APMC
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-slate-100/70 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                <Link
                  to="/app/market"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View All Mandi & Weather Advisories →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          to="/login"
          className="flex items-center gap-2 rounded-xl border border-slate-200 p-1 pl-1.5 pr-2 hover:bg-slate-50 transition"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
            RK
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-800">
            Ramesh
          </span>
        </Link>
      </div>
    </header>
  );
}

export default TopNavbar;