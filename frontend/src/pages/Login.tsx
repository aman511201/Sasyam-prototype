import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  Leaf,
  Sprout,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("9876543210");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState<"farmer" | "fpo" | "trader">("farmer");
  const [lang, setLang] = useState<"EN" | "HI" | "PA">("EN");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSent(true);
    setOtp("4829"); // simulated autofill
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/dashboard");
  };

  const handleQuickDemoLogin = () => {
    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      <div className="mx-auto w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Platform Branding & Highlights */}
        <div className="lg:col-span-6 space-y-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-900/50">
              <Leaf size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">Sasyam</h1>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-emerald-400">AI Post-Harvest Decision & Pathology Platform</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Empowering Indian Farmers with <span className="text-emerald-400">AI Intelligence</span> & Zero Spoilage
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time APMC Mandi price discovery, computer vision crop disease diagnostics, cold-chain shelf life optimization, and personalized ICAR advisory.
            </p>
          </div>

          {/* Value highlights */}
          <div className="space-y-3 pt-2">
            {[
              "Computer Vision Neural Diagnosis for 20+ Leaf Pathogens",
              "Multi-Channel Profit Optimizer (Local vs Metro vs Cold Storage)",
              "Live e-NAM & APMC Mandi Market Price Forecasting",
              "Multilingual 24/7 Kisan AI Assistant (Voice & Text)",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={14} />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Quick Demo Button for Hackathon Judges */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  ⭐ Hackathon Judge Quick Access
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Skip OTP & explore full platform with pre-loaded demo farm data
                </p>
              </div>
              <button
                onClick={handleQuickDemoLogin}
                className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-950 transition flex items-center gap-1.5 shrink-0"
              >
                Instant Demo Login <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login Box */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl space-y-6">
            {/* Header & Language */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Farmer Sign In</h3>
                <p className="text-xs text-slate-400">Access your digital farm records</p>
              </div>

              {/* Language toggle */}
              <div className="flex rounded-xl border border-slate-700 bg-slate-800 p-1 text-xs">
                {(["EN", "HI", "PA"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`rounded-lg px-2 py-1 font-semibold transition ${
                      lang === l ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {l === "EN" ? "EN" : l === "HI" ? "हिंदी" : "ਪੰ"}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "farmer", label: "Farmer / Kisan", icon: Sprout },
                  { id: "fpo", label: "FPO Leader", icon: Users },
                  { id: "trader", label: "Mandi Buyer", icon: Building2 },
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition ${
                        role === r.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                          : "border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <Icon size={16} className="mb-1" />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Mobile Number / PM-Kisan ID
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                  <span className="text-xs font-semibold text-slate-500">+91</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1.5 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-300">Enter OTP</label>
                    <span className="text-emerald-400">Code auto-filled: 4829</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-white focus-within:border-emerald-500">
                    <KeyRound size={16} className="text-emerald-500" />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="w-full bg-transparent text-sm tracking-widest outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-950 transition"
              >
                {otpSent ? "Verify & Open Sasyam" : "Get Verification OTP"}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800/80">
              <p className="text-xs text-slate-500">
                Integrated with e-NAM, Pradhan Mantri Fasal Bima Yojana & ICAR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;