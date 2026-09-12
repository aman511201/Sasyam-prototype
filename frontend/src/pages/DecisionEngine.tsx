  import { useState, useMemo } from "react";
import {
  BarChart3,
  BrainCircuit,
  Building2,
  Package,
  Sparkles,
  Store,
  Truck,
  Warehouse,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Link } from "react-router-dom";

interface CropPreset {
  name: string;
  defaultQuantity: number;
  localPrice: number;
  metroPrice: number;
  distanceKm: number;
  storageRentMonth: number;
  storageDays: number;
  expectedPriceSurgePercent: number;
  spoilageRatePerWeek: number;
  processorPrice: number;
}

const cropPresets: Record<string, CropPreset> = {
  Tomato: {
    name: "Tomato (Fresh Harvest)",
    defaultQuantity: 80, // quintals
    localPrice: 2100,
    metroPrice: 3400,
    distanceKm: 180,
    storageRentMonth: 140,
    storageDays: 20,
    expectedPriceSurgePercent: 35,
    spoilageRatePerWeek: 4.5,
    processorPrice: 2450,
  },
  Potato: {
    name: "Potato (Cold Storable)",
    defaultQuantity: 150,
    localPrice: 1350,
    metroPrice: 1900,
    distanceKm: 220,
    storageRentMonth: 95,
    storageDays: 45,
    expectedPriceSurgePercent: 42,
    spoilageRatePerWeek: 1.2,
    processorPrice: 1550,
  },
  Onion: {
    name: "Rabi Onion (Nashik Grade)",
    defaultQuantity: 120,
    localPrice: 1800,
    metroPrice: 2750,
    distanceKm: 260,
    storageRentMonth: 110,
    storageDays: 30,
    expectedPriceSurgePercent: 30,
    spoilageRatePerWeek: 2.0,
    processorPrice: 1950,
  },
  Wheat: {
    name: "Sharbati Wheat",
    defaultQuantity: 200,
    localPrice: 2450,
    metroPrice: 2900,
    distanceKm: 150,
    storageRentMonth: 60,
    storageDays: 60,
    expectedPriceSurgePercent: 18,
    spoilageRatePerWeek: 0.2,
    processorPrice: 2600,
  },
};

function DecisionEngine() {
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");
  const preset = cropPresets[selectedCrop];

  const [quantity, setQuantity] = useState<number>(preset.defaultQuantity);
  const [localPrice, setLocalPrice] = useState<number>(preset.localPrice);
  const [metroPrice, setMetroPrice] = useState<number>(preset.metroPrice);
  const [distanceKm, setDistanceKm] = useState<number>(preset.distanceKm);
  const [storageDays, setStorageDays] = useState<number>(preset.storageDays);
  const [storageRentMonth, setStorageRentMonth] = useState<number>(preset.storageRentMonth);
  const [priceSurgePercent, setPriceSurgePercent] = useState<number>(preset.expectedPriceSurgePercent);
  const [spoilageRateWeek, setSpoilageRateWeek] = useState<number>(preset.spoilageRatePerWeek);
  const [processorPrice, setProcessorPrice] = useState<number>(preset.processorPrice);

  // When crop preset changes, update states
  const handlePresetChange = (cropKey: string) => {
    setSelectedCrop(cropKey);
    const p = cropPresets[cropKey];
    setQuantity(p.defaultQuantity);
    setLocalPrice(p.localPrice);
    setMetroPrice(p.metroPrice);
    setDistanceKm(p.distanceKm);
    setStorageDays(p.storageDays);
    setStorageRentMonth(p.storageRentMonth);
    setPriceSurgePercent(p.expectedPriceSurgePercent);
    setSpoilageRateWeek(p.spoilageRatePerWeek);
    setProcessorPrice(p.processorPrice);
  };

  // Calculations
  const analysis = useMemo(() => {
    // 1. Channel A: Immediate Local Mandi Sale
    const localGross = quantity * localPrice;
    const localTransport = quantity * 25; // ₹25/qtl local cartage
    const localMandiFee = localGross * 0.015; // 1.5% APMC cess
    const localNetProfit = localGross - localTransport - localMandiFee;

    // 2. Channel B: Distant Metro APMC Mandi Sale
    const metroGross = quantity * metroPrice;
    const freightRatePerKmQtl = 1.4; // ₹1.4 per quintal per km
    const metroTransport = quantity * distanceKm * freightRatePerKmQtl;
    const transitSpoilagePercent = (distanceKm / 100) * 0.8; // 0.8% loss per 100km
    const metroSpoilageLoss = metroGross * (transitSpoilagePercent / 100);
    const metroMandiFee = metroGross * 0.02;
    const metroNetProfit = metroGross - metroTransport - metroSpoilageLoss - metroMandiFee;

    // 3. Channel C: Cold Storage & Delayed Off-Season Sale
    const futureExpectedPrice = localPrice * (1 + priceSurgePercent / 100);
    const storageWeeks = storageDays / 7;
    const storageSpoilageLossPercent = Math.min(25, storageWeeks * (spoilageRateWeek * 0.5)); // cold storage reduces loss by 50%
    const saleableQuantity = quantity * (1 - storageSpoilageLossPercent / 100);
    const coldGross = saleableQuantity * futureExpectedPrice;
    const totalStorageRent = quantity * (storageRentMonth / 30) * storageDays;
    const coldInflowOutflowTransport = quantity * 40;
    const coldNetProfit = coldGross - totalStorageRent - coldInflowOutflowTransport;

    // 4. Channel D: Direct Food Processing Industry Buyout
    const processorGross = quantity * processorPrice;
    const processorTransport = quantity * 35;
    const processorNetProfit = processorGross - processorTransport;

    const channels = [
      {
        id: "cold_storage",
        title: "Cold Storage + Delayed Off-Season Sale",
        icon: Warehouse,
        netProfit: coldNetProfit,
        gross: coldGross,
        costs: totalStorageRent + coldInflowOutflowTransport,
        risk: storageDays > 30 && selectedCrop === "Tomato" ? "Moderate" : "Low",
        speed: `${storageDays} Days Hold`,
        description: `Store in local CA/Cold Chamber and sell when mandi rates increase by estimated ${priceSurgePercent}%.`,
        breakdown: [
          `Anticipated Rate: ₹${futureExpectedPrice.toFixed(0)}/qtl`,
          `Storage Rent: ₹${totalStorageRent.toFixed(0)}`,
          `Estimated Weight/Spoilage: ${(storageSpoilageLossPercent).toFixed(1)}%`,
        ],
      },
      {
        id: "metro_mandi",
        title: "Distant Metro Mandi (APMC Hub)",
        icon: Truck,
        netProfit: metroNetProfit,
        gross: metroGross,
        costs: metroTransport + metroSpoilageLoss + metroMandiFee,
        risk: distanceKm > 200 ? "Medium" : "Low",
        speed: "24 - 48 Hours",
        description: `Transport stock ${distanceKm} km to high-demand metropolitan mandi (e.g. Azadpur / Vashi).`,
        breakdown: [
          `Mandi Rate: ₹${metroPrice}/qtl`,
          `Logistics & Fuel: ₹${metroTransport.toFixed(0)}`,
          `Transit Spoilage: ₹${metroSpoilageLoss.toFixed(0)}`,
        ],
      },
      {
        id: "processor",
        title: "Contract Processing Unit / FMCG",
        icon: Building2,
        netProfit: processorNetProfit,
        gross: processorGross,
        costs: processorTransport,
        risk: "Very Low",
        speed: "Guaranteed 24h Buyout",
        description: `Direct supply agreement with food processing / canning unit at pre-fixed rate.`,
        breakdown: [
          `Contract Rate: ₹${processorPrice}/qtl`,
          `No APMC Mandi Cess`,
          `Zero Price Fluctuation Risk`,
        ],
      },
      {
        id: "local_mandi",
        title: "Immediate Local APMC Mandi Sale",
        icon: Store,
        netProfit: localNetProfit,
        gross: localGross,
        costs: localTransport + localMandiFee,
        risk: "Zero Risk",
        speed: "Same Day Instant Cash",
        description: "Liquidate batch at local taluka mandi immediately without storage or distant freight overhead.",
        breakdown: [
          `Current Spot Rate: ₹${localPrice}/qtl`,
          `Local Cartage: ₹${localTransport.toFixed(0)}`,
          `APMC Fee (1.5%): ₹${localMandiFee.toFixed(0)}`,
        ],
      },
    ];

    // Sort by maximum net profit
    const sorted = [...channels].sort((a, b) => b.netProfit - a.netProfit);
    const best = sorted[0];
    const extraGainOverLocal = best.netProfit - localNetProfit;

    return {
      channels,
      sorted,
      best,
      extraGainOverLocal,
      localNetProfit,
    };
  }, [
    quantity,
    localPrice,
    metroPrice,
    distanceKm,
    storageDays,
    storageRentMonth,
    priceSurgePercent,
    spoilageRateWeek,
    processorPrice,
    selectedCrop,
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Smart Multi-Channel Decision Engine"
        description="Linear optimization algorithm comparing Immediate Mandi, Metro Transport, Cold Storage Preservation, and Food Processing channels to maximize farmer net earnings."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Preset:</span>
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {Object.keys(cropPresets).map((key) => (
                <button
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    selectedCrop === key
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                
                  {key}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* AI Top Recommendation Callout */}
      <div className="rounded-2xl border border-emerald-300/80 bg-gradient-to-r from-emerald-950 to-slate-900 p-5 sm:p-6 text-white shadow-lg shadow-emerald-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              <Sparkles size={14} className="text-emerald-400" />
              AI Optimal Decision Recommendation
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {analysis.best.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {analysis.best.description} Generates the highest net return after deducting transport, storage rent, and spoilage degradation.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/10 text-center min-w-56 shrink-0">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Projected Net Profit
            </p>
            <p className="text-3xl font-black text-white mt-0.5">
              ₹{analysis.best.netProfit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
            {analysis.extraGainOverLocal > 0 && (
              <p className="mt-1 text-xs font-bold text-emerald-400">
                +₹{analysis.extraGainOverLocal.toLocaleString("en-IN", { maximumFractionDigits: 0 })} (+{((analysis.extraGainOverLocal / analysis.localNetProfit) * 100).toFixed(1)}%) vs Local Mandi
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Parameter Controls vs Comparative Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders & Variables */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BrainCircuit size={18} className="text-emerald-600" />
                Live Optimization Parameters
              </h3>
              <button
                onClick={() => handlePresetChange(selectedCrop)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Reset
              </button>
            </div>

            {/* Batch Quantity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Harvest Batch Quantity</span>
                <span className="text-emerald-700 font-bold">{quantity} Quintals ({quantity * 100} kg)</span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={5}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Local Mandi Spot Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Local APMC Mandi Spot Rate</span>
                <span className="text-slate-900 font-bold">₹{localPrice} / quintal</span>
              </div>
              <input
                type="range"
                min={500}
                max={6000}
                step={50}
                value={localPrice}
                onChange={(e) => setLocalPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Metro Mandi Rate & Distance */}
            <div className="rounded-xl bg-slate-50 p-3 space-y-3 border border-slate-100">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Truck size={14} className="text-slate-500" />
                    Metro APMC Mandi Price
                  </span>
                  <span className="text-slate-900 font-bold">₹{metroPrice} / quintal</span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={7000}
                  step={50}
                  value={metroPrice}
                  onChange={(e) => setMetroPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Transit Distance to Metro Hub</span>
                  <span className="text-slate-900 font-bold">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={600}
                  step={10}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Cold Storage Parameters */}
            <div className="rounded-xl bg-slate-50 p-3 space-y-3 border border-slate-100">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Warehouse size={14} className="text-slate-500" />
                    Cold Storage Duration
                  </span>
                  <span className="text-slate-900 font-bold">{storageDays} Days</span>
                </div>
                <input
                  type="range"
                  min={7}
                  max={90}
                  step={1}
                  value={storageDays}
                  onChange={(e) => setStorageDays(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Expected Off-Season Price Surge</span>
                  <span className="text-emerald-600 font-bold">+{priceSurgePercent}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  step={1}
                  value={priceSurgePercent}
                  onChange={(e) => setPriceSurgePercent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <span>Storage Rent: ₹{storageRentMonth}/qtl/month</span>
                <span>Base Decay: {spoilageRateWeek}%/wk</span>
              </div>
            </div>

            {/* Food Processor Contract Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Building2 size={14} className="text-slate-500" />
                  Food Processing Buyout Rate
                </span>
                <span className="text-slate-900 font-bold">₹{processorPrice} / quintal</span>
              </div>
              <input
                type="range"
                min={500}
                max={5000}
                step={50}
                value={processorPrice}
                onChange={(e) => setProcessorPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Channel Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-600" />
              4-Channel Comparative Analysis
            </h3>
            <span className="text-xs text-slate-500">Sorted by Net Returns</span>
          </div>

          <div className="space-y-3">
            {analysis.sorted.map((channel, index) => {
              const Icon = channel.icon;
              const isBest = index === 0;

              return (
                <div
                  key={channel.id}
                  className={`rounded-2xl border p-5 transition-all shadow-sm ${
                    isBest
                      ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isBest
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {channel.title}
                          </h4>
                          {isBest && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide">
                              Highest ROI ★
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{channel.description}</p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase">
                        Net Earnings
                      </p>
                      <p
                        className={`text-xl font-black ${
                          isBest ? "text-emerald-600" : "text-slate-900"
                        }`}
                      >
                        ₹{channel.netProfit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  {/* Channel Data Pills */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {channel.breakdown.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-slate-600 font-medium border border-slate-100"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Metrics footer */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>Speed: <strong className="text-slate-700">{channel.speed}</strong></span>
                      <span>Risk: <strong className="text-slate-700">{channel.risk}</strong></span>
                    </div>
                    <span>Total Deductions: <strong>₹{channel.costs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/app/produce"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              <Package size={16} />
              Book / Log in Produce Storage
            </Link>

            <Link
              to="/app/market"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <Store size={16} />
              Check Live APMC Mandi Rates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecisionEngine;